import { ConflictException, Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { User } from "@prisma/client";
import * as bcrypt from "bcrypt";
import { PrismaService } from "../../prisma/prisma.service";
import { REFRESH_TOKEN_COOKIE } from "./auth.constants";
import { LoginDto } from "./dto/login.dto";
import { RegisterDto } from "./dto/register.dto";

interface JwtPayload {
  sub: string;
  email: string;
}

interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

@Injectable()
export class AuthService {
  private readonly refreshCookieName = REFRESH_TOKEN_COOKIE;

  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService
  ) {}

  get refreshTokenCookieName() {
    return this.refreshCookieName;
  }

  async register(dto: RegisterDto) {
    const email = dto.email.toLowerCase();
    const existingUser = await this.prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      throw new ConflictException("USER_ALREADY_EXISTS");
    }

    const passwordHash = await bcrypt.hash(dto.password, 12);
    const user = await this.prisma.user.create({
      data: {
        email,
        passwordHash,
        locale: dto.locale ?? "ka",
        firstName: dto.firstName,
        lastName: dto.lastName
      }
    });

    const tokens = await this.generateTokens(user);
    await this.setRefreshToken(user.id, tokens.refreshToken);

    return {
      user: this.sanitizeUser(user),
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken
    };
  }

  async login(dto: LoginDto) {
    const email = dto.email.toLowerCase();
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw new UnauthorizedException("INVALID_CREDENTIALS");
    }

    const isValid = await bcrypt.compare(dto.password, user.passwordHash);
    if (!isValid) {
      throw new UnauthorizedException("INVALID_CREDENTIALS");
    }

    const tokens = await this.generateTokens(user);
    await this.setRefreshToken(user.id, tokens.refreshToken);

    return {
      user: this.sanitizeUser(user),
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken
    };
  }

  async refresh(userId: string, refreshToken?: string) {
    if (!refreshToken) {
      throw new UnauthorizedException("REFRESH_FAILED");
    }

    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user || !user.refreshTokenHash) {
      throw new UnauthorizedException("REFRESH_FAILED");
    }

    const isValid = await bcrypt.compare(refreshToken, user.refreshTokenHash);
    if (!isValid) {
      throw new UnauthorizedException("REFRESH_FAILED");
    }

    const tokens = await this.generateTokens(user);
    await this.setRefreshToken(user.id, tokens.refreshToken);

    return {
      user: this.sanitizeUser(user),
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken
    };
  }

  async logout(userId: string) {
    await this.prisma.user.update({
      where: { id: userId },
      data: { refreshTokenHash: null }
    });
  }

  private async generateTokens(user: User): Promise<AuthTokens> {
    const payload: JwtPayload = { sub: user.id, email: user.email };
    const accessToken = await this.jwtService.signAsync(payload, {
      expiresIn: this.configService.get<string>("JWT_ACCESS_EXPIRES_IN", "15m")
    });
    const refreshToken = await this.jwtService.signAsync(payload, {
      secret: this.configService.get<string>("JWT_REFRESH_SECRET", "change_me_too"),
      expiresIn: this.configService.get<string>("JWT_REFRESH_EXPIRES_IN", "7d")
    });
    return { accessToken, refreshToken };
  }

  private async setRefreshToken(userId: string, refreshToken: string) {
    const hash = await bcrypt.hash(refreshToken, 12);
    await this.prisma.user.update({
      where: { id: userId },
      data: { refreshTokenHash: hash }
    });
  }

  private sanitizeUser(user: User) {
    const { passwordHash: _passwordHash, refreshTokenHash: _refreshTokenHash, ...safeUser } = user;
    void _passwordHash;
    void _refreshTokenHash;
    return safeUser;
  }
}




import { Body, Controller, Get, HttpCode, HttpStatus, Post, Req, Res, UseGuards } from "@nestjs/common";
import { Request, Response } from "express";
import { CurrentUser } from "../../common/decorators/current-user.decorator";
import { AccessTokenGuard } from "../../common/guards/access-token.guard";
import { RefreshTokenGuard } from "../../common/guards/refresh-token.guard";
import { RequestUser } from "../../common/types/request-user";
import { AuthService } from "./auth.service";
import { LoginDto } from "./dto/login.dto";
import { RegisterDto } from "./dto/register.dto";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get("me")
  @UseGuards(AccessTokenGuard)
  async me(@CurrentUser() user: RequestUser) {
    const profile = await this.authService.profile(user.id);
    return { user: profile };
  }

  @Post("register")
  async register(@Body() dto: RegisterDto, @Res({ passthrough: true }) res: Response) {
    const result = await this.authService.register(dto);
    this.attachRefreshCookie(res, result.refreshToken);
    return {
      user: result.user,
      accessToken: result.accessToken
    };
  }

  @Post("login")
  @HttpCode(HttpStatus.OK)
  async login(@Body() dto: LoginDto, @Res({ passthrough: true }) res: Response) {
    const result = await this.authService.login(dto);
    this.attachRefreshCookie(res, result.refreshToken);
    return {
      user: result.user,
      accessToken: result.accessToken
    };
  }

  @Post("refresh")
  @UseGuards(RefreshTokenGuard)
  @HttpCode(HttpStatus.OK)
  async refresh(@CurrentUser() user: RequestUser, @Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const refreshToken = req.cookies?.[this.authService.refreshTokenCookieName];
    const result = await this.authService.refresh(user.id, refreshToken);
    this.attachRefreshCookie(res, result.refreshToken);
    return {
      user: result.user,
      accessToken: result.accessToken
    };
  }

  @Post("logout")
  @UseGuards(AccessTokenGuard)
  @HttpCode(HttpStatus.OK)
  async logout(@CurrentUser() user: RequestUser, @Res({ passthrough: true }) res: Response) {
    await this.authService.logout(user.id);
    res.clearCookie(this.authService.refreshTokenCookieName, this.getCookieOptions(true));
    return { success: true };
  }

  private attachRefreshCookie(res: Response, token: string) {
    res.cookie(this.authService.refreshTokenCookieName, token, this.getCookieOptions());
  }

  private getCookieOptions(clear = false) {
    const isProd = process.env.NODE_ENV === "production";
    return {
      httpOnly: true,
      secure: isProd,
      sameSite: "strict" as const,
      path: "/",
      expires: clear ? new Date(0) : undefined
    };
  }
}

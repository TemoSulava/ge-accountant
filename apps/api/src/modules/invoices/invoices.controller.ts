import { Body, Controller, Get, Param, Patch, Post, UseGuards } from "@nestjs/common";
import { CurrentUser } from "../../common/decorators/current-user.decorator";
import { AccessTokenGuard } from "../../common/guards/access-token.guard";
import { RequestUser } from "../../common/types/request-user";
import { CreateInvoiceDto, CreatePaymentDto, UpdateInvoiceStatusDto } from "./dto/invoice.dto";
import { InvoicesService } from "./invoices.service";

@UseGuards(AccessTokenGuard)
@Controller("entities/:entityId/invoices")
export class InvoicesController {
  constructor(private readonly invoicesService: InvoicesService) {}

  @Get()
  list(@CurrentUser() user: RequestUser, @Param("entityId") entityId: string) {
    return this.invoicesService.list(user, entityId);
  }

  @Post()
  create(
    @CurrentUser() user: RequestUser,
    @Param("entityId") entityId: string,
    @Body() dto: CreateInvoiceDto
  ) {
    return this.invoicesService.create(user, entityId, dto);
  }

  @Get(":invoiceId")
  getById(@CurrentUser() user: RequestUser, @Param("invoiceId") invoiceId: string) {
    return this.invoicesService.getById(user, invoiceId);
  }

  @Patch(":invoiceId")
  updateStatus(
    @CurrentUser() user: RequestUser,
    @Param("invoiceId") invoiceId: string,
    @Body() dto: UpdateInvoiceStatusDto
  ) {
    return this.invoicesService.updateStatus(user, invoiceId, dto);
  }

  @Post(":invoiceId/payments")
  addPayment(
    @CurrentUser() user: RequestUser,
    @Param("invoiceId") invoiceId: string,
    @Body() dto: CreatePaymentDto
  ) {
    return this.invoicesService.addPayment(user, invoiceId, dto);
  }
}

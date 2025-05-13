import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { AuditService } from "./audit.service";
import { Observable } from "rxjs/internal/Observable";
import { tap } from "rxjs";

@Injectable()
export class AuditInterceptor implements NestInterceptor {
  constructor(
    private readonly reflector: Reflector,
    private readonly auditService: AuditService,
  ) { }

  intercept(ctx: ExecutionContext, next: CallHandler<any>): Observable<any> {
    const req = ctx.switchToHttp().getRequest();
    const isSkipped =
      this.reflector.getAllAndOverride<boolean>('skipAudit', [
        ctx.getHandler(),
        ctx.getClass(),
      ]);

    if (isSkipped) return next.handle();

    const data = {
      userId: req.user?.userID ?? null,
      email: req.user?.email   ?? null,
      route: req.route?.path ?? req.originalUrl,
      method: req.method,
      action: `${req.method} ${req.route?.path ?? req.originalUrl}`,
      payload: req.body ?? null,
      ip: req.ip,
    }

    return next.handle().pipe(
      tap(async ()=> await this.auditService.create(data))
    );
  }
}
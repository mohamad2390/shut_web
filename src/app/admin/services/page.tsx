import { ServiceCatalogEditor } from "@/components/ServiceCatalogEditor";
import { authedGet } from "@/lib/backend";
import type { AdminService, AdminUnit } from "@/lib/types";

export default async function AdminServicesPage() {
  const [services, units] = await Promise.all([
    authedGet<AdminService[]>("/api/v1/admin/services"),
    authedGet<AdminUnit[]>("/api/v1/admin/units"),
  ]);
  return (
    <>
      <section className="hero">
        <h1>خدمت‌ها و واحدها</h1>
        <p>همین فهرست توی تعرفه‌ی وب و ربات نشون داده می‌شه. خدمت غیرفعال دیگه انتخاب نمی‌شه ولی قیمت‌های قبلی می‌مونن.</p>
      </section>
      <ServiceCatalogEditor services={services} units={units} />
    </>
  );
}

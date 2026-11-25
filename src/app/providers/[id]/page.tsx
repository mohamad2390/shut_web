import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Pagination } from "@/components/Pagination";
import { Rating } from "@/components/Rating";
import { ShowcaseGrid } from "@/components/ShowcaseGrid";
import { getProvider, getShowcaseCategories, getShowcaseItems } from "@/lib/api";
import { fa, safeWebUrl } from "@/lib/format";
import type { EquipmentItem } from "@/lib/types";

interface Props {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ category?: string; page?: string }>;
}

function parseId(text: string): number {
  const id = Number(text);
  if (!Number.isInteger(id) || id <= 0) notFound();
  return id;
}

export async function generateMetadata({ params }: Pick<Props, "params">): Promise<Metadata> {
  const provider = await getProvider(parseId((await params).id));
  return provider ? { title: provider.displayName, description: provider.headline ?? undefined } : {};
}

/** Gear grouped by its type: «دوربین: Sony Alpha 7 IV، Canon R5». */
function groupByType(items: EquipmentItem[]): [string, string[]][] {
  const groups = new Map<string, string[]>();
  for (const item of items) {
    const names = groups.get(item.type) ?? [];
    names.push(`${item.brand} ${item.model}`);
    groups.set(item.type, names);
  }
  return [...groups.entries()];
}

export default async function ProviderPage({ params, searchParams }: Props) {
  const id = parseId((await params).id);
  const { category: categoryKey, page: pageText } = await searchParams;

  const provider = await getProvider(id);
  if (!provider) notFound();

  const categories = await getShowcaseCategories(id);
  const active = categories.find((entry) => entry.category.key === categoryKey) ?? categories[0];
  const page = Math.max(0, Number.parseInt(pageText ?? "0", 10) || 0);
  const items = active ? await getShowcaseItems(id, active.category.key, page) : null;

  const website = safeWebUrl(provider.websiteUrl);
  const place = [provider.city, provider.country].filter(Boolean).join("، ");

  return (
    <article className="profile">
      <p className="back">
        <Link href="/">← همه‌ی متخصص‌ها</Link>
      </p>

      <header className="profile__head">
        <h1>{provider.displayName}</h1>
        {provider.headline && <p className="profile__headline">{provider.headline}</p>}
        <p className="profile__meta">
          {[place, provider.yearsExperience ? `${fa(provider.yearsExperience)} سال سابقه` : null]
            .filter(Boolean)
            .join(" · ")}
        </p>
        <Rating value={provider.rating} />
        <ul className="contacts" aria-label="راه‌های ارتباط">
          {provider.telegramUsername && (
            <li>
              <a href={`https://t.me/${provider.telegramUsername}`} rel="noopener noreferrer">
                پیام در تلگرام
              </a>
            </li>
          )}
          {provider.instagramUsername && (
            <li>
              <a href={`https://instagram.com/${provider.instagramUsername}`} rel="noopener noreferrer">
                اینستاگرام
              </a>
            </li>
          )}
          {website && (
            <li>
              <a href={website} rel="noopener noreferrer">
                وب‌سایت
              </a>
            </li>
          )}
        </ul>
      </header>

      {provider.bio && (
        <section>
          <h2>درباره</h2>
          <p className="prose">{provider.bio}</p>
        </section>
      )}

      <section className="facts">
        {provider.skills.length > 0 && (
          <div>
            <h2>مهارت‌ها</h2>
            <ul className="chips">
              {provider.skills.map((skill) => (
                <li key={skill}>{skill}</li>
              ))}
            </ul>
          </div>
        )}
        {provider.serviceCities.length > 0 && (
          <div>
            <h2>شهرهای خدمت</h2>
            <p>{provider.serviceCities.join("، ")}</p>
          </div>
        )}
        {provider.collaborators.length > 0 && (
          <div>
            <h2>همکاری با</h2>
            <p>{provider.collaborators.join("، ")}</p>
          </div>
        )}
      </section>

      {(provider.equipment.length > 0 || provider.equipmentNotes) && (
        <section>
          <h2>تجهیزات</h2>
          <dl className="gear">
            {groupByType(provider.equipment).map(([type, names]) => (
              <div key={type}>
                <dt>{type}</dt>
                <dd>{names.join("، ")}</dd>
              </div>
            ))}
          </dl>
          {provider.equipmentNotes && <p className="prose">{provider.equipmentNotes}</p>}
        </section>
      )}

      <section>
        <h2>نمونه‌کار</h2>
        {categories.length === 0 ? (
          <p className="empty">هنوز نمونه‌کاری گذاشته نشده.</p>
        ) : (
          <>
            <nav className="tabs" aria-label="بخش‌های نمونه‌کار">
              {categories.map((entry) => (
                <Link
                  key={entry.category.key}
                  href={`/providers/${id}?category=${entry.category.key}`}
                  aria-current={entry.category.key === active?.category.key ? "page" : undefined}
                >
                  {entry.category.label} ({fa(entry.count)})
                </Link>
              ))}
            </nav>
            {items && <ShowcaseGrid providerId={id} items={items.items} />}
            {items && active && (
              <Pagination
                basePath={`/providers/${id}`}
                params={{ category: active.category.key }}
                page={items.page}
                totalPages={items.totalPages}
              />
            )}
          </>
        )}
      </section>
    </article>
  );
}

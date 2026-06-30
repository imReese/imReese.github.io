import Link from "next/link"
import { ArrowRight, FileText } from "lucide-react"
import { formatDate } from "@/lib/formatDate"
import { type BlogType } from "@/lib/blogs"

export function HomepageNotes({ blogs }: { blogs: BlogType[] }) {
  return (
    <section className="rounded-2xl border border-border/70 bg-card/70 p-6 shadow-sm backdrop-blur">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Engineering notes</h2>
          <p className="mt-2 text-sm leading-7 text-muted-foreground">
            Short notes on backend systems, cloud-native tools, and the occasional life log.
          </p>
        </div>
        <Link href="/blogs" className="inline-flex items-center gap-1 text-sm font-semibold text-primary">
          All notes
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      <div className="mt-6 grid gap-3">
        {blogs.length > 0 ? (
          blogs.map((blog) => (
            <Link
              key={blog.slug}
              href={`/blogs/${blog.slug}`}
              className="group rounded-xl border border-border/60 bg-background/55 p-4 transition hover:-translate-y-0.5 hover:border-primary/40 hover:bg-primary/5"
            >
              <div className="flex items-start gap-3">
                <span className="mt-1 flex h-8 w-8 flex-none items-center justify-center rounded-full bg-primary/10 text-primary">
                  <FileText className="h-4 w-4" />
                </span>
                <div>
                  <time dateTime={blog.date} className="text-xs text-muted-foreground">
                    {formatDate(blog.date)}
                  </time>
                  <h3 className="mt-1 text-base font-semibold text-foreground group-hover:text-primary">
                    {blog.title}
                  </h3>
                  <p className="mt-1 text-sm leading-6 text-muted-foreground">{blog.description}</p>
                </div>
              </div>
            </Link>
          ))
        ) : (
          <div className="rounded-xl border border-dashed border-border bg-background/55 p-4 text-sm text-muted-foreground">
            Notes are warming up. The archive is ready when the first field log lands.
          </div>
        )}
      </div>
    </section>
  )
}

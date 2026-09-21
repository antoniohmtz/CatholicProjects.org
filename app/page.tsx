import type { Metadata } from "next"
import Image from "next/image"
import styles from "./page.module.css"

export const metadata: Metadata = {
    title: "CatholicProjects — In Beta",
    description:
        "CatholicProjects is currently in beta. We are building a free Catholic resource platform, beginning with source-linked Saint profiles and worksheets.",
    robots: {
        index: false,
        follow: false,
    },
}

export default function HomePage() {
    return (
        <main className={styles.page}>
            <div className={styles.topGlow} aria-hidden="true" />
            <div className={styles.bottomGlow} aria-hidden="true" />

            <section className={styles.panel}>
                <header className={styles.hero}>
                    <div className={styles.logoWrap}>
                        <Image
                            src="/brand/catholicprojects-logo.png"
                            alt="CatholicProjects.org"
                            width={900}
                            height={260}
                            priority
                            className={styles.wordmark}
                            sizes="(max-width: 640px) 88vw, (max-width: 900px) 620px, 720px"
                        />
                    </div>

                    <div className={styles.statusRow}>
                        <div className={styles.status}>
                            <span
                                className={styles.statusDot}
                                aria-hidden="true"
                            />

                            <span>In Beta</span>

                            <span
                                className={styles.statusSeparator}
                                aria-hidden="true"
                            >
                                •
                            </span>

                            <span>Currently in Production</span>
                        </div>
                    </div>

                    <h1>
                        Free Catholic resources,
                        <span> built from the sources.</span>
                    </h1>

                    <p className={styles.lead}>
                        We are building CatholicProjects carefully — starting
                        with the lives of the Saints and creating resources
                        families, parishes, catechists, educators, and students
                        can use for free.
                    </p>

                    <div
                        className={styles.foundation}
                        aria-label="How CatholicProjects resources are built"
                    >
                        <span>Catholic sources</span>

                        <i aria-hidden="true">→</i>

                        <span>Documented profiles</span>

                        <i aria-hidden="true">→</i>

                        <span>Free resources</span>
                    </div>
                </header>

                <div className={styles.rule} />

                <section
                    className={styles.progress}
                    aria-label="Current development"
                >
                    <article className={styles.progressItem}>
                        <div className={styles.step}>01</div>

                        <div className={styles.progressContent}>
                            <div className={styles.eyebrow}>
                                WHERE WE ARE STARTING
                            </div>

                            <h2>The lives of the Saints.</h2>

                            <p>
                                Our first phase is focused on documented Saint
                                profiles with direct links to the Catholic
                                sources used to build them.
                            </p>
                        </div>
                    </article>

                    <article className={styles.progressItem}>
                        <div className={styles.step}>02</div>

                        <div className={styles.progressContent}>
                            <div className={styles.eyebrow}>
                                WHAT WE ARE BUILDING NEXT
                            </div>

                            <h2>
                                Resources families can actually use.
                            </h2>

                            <p>
                                Worksheets, activities, coloring pages, and
                                other materials will be developed from the
                                researched profiles for parents, parishes,
                                catechists, and educators.
                            </p>
                        </div>
                    </article>
                </section>

                <aside className={styles.commitment}>
                    <div
                        className={styles.commitmentMark}
                        aria-hidden="true"
                    >
                        ✦
                    </div>

                    <div>
                        <div className={styles.eyebrow}>
                            OUR COMMITMENT
                        </div>

                        <p>
                            CatholicProjects will remain free to access. We
                            believe Catholic resources created in service to
                            our Lord and Savior Jesus Christ should be
                            available to the people who need them.
                        </p>
                    </div>
                </aside>

                <footer className={styles.footer}>
                    <div className={styles.actions}>
                        <a
                            className={styles.primaryButton}
                            href="https://catholicprojects.org"
                        >
                            <span aria-hidden="true">←</span>
                            <span>Return to CatholicProjects.org</span>
                        </a>

                        <a
                            className={styles.secondaryButton}
                            href="mailto:team@catholicprojects.org"
                        >
                            Contact us
                        </a>
                    </div>

                    <p className={styles.footerNote}>
                        We&apos;re building carefully. Thank you for your
                        patience while CatholicProjects is in production.
                    </p>
                </footer>
            </section>
        </main>
    )
}

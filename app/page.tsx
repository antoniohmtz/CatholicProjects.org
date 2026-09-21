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

            <section className={styles.card}>
                <div className={styles.brand}>
                    <Image
                        src="/brand/catholicprojects-wordmark.png"
                        alt="CatholicProjects.org"
                        width={720}
                        height={170}
                        priority
                        className={styles.wordmark}
                    />
                </div>

                <div className={styles.status}>
                    <span className={styles.statusDot} aria-hidden="true" />
                    Beta
                    <span className={styles.statusSeparator} aria-hidden="true">
                        •
                    </span>
                    Currently in production
                </div>

                <h1>
                    We&apos;re building the
                    <span> first phase.</span>
                </h1>

                <p className={styles.lead}>
                    CatholicProjects is building a free Catholic resource
                    platform for families, parishes, catechists, educators,
                    students, and anyone who wants to learn more about the
                    faith.
                </p>

                <div className={styles.divider} />

                <div className={styles.content}>
                    <article className={styles.section}>
                        <div className={styles.eyebrow}>WHERE WE ARE STARTING</div>

                        <h2>The lives of the Saints.</h2>

                        <p>
                            Our first phase is focused on documented Saint
                            profiles with direct links to the Catholic sources
                            used to build them.
                        </p>
                    </article>

                    <article className={styles.section}>
                        <div className={styles.eyebrow}>WHAT COMES FROM IT</div>

                        <h2>Free resources families can use.</h2>

                        <p>
                            We are developing worksheets, activities, coloring
                            pages, and other resources from those researched
                            profiles for parents, parishes, catechists, and
                            educators.
                        </p>
                    </article>
                </div>

                <aside className={styles.promise}>
                    <div className={styles.promiseLabel}>OUR COMMITMENT</div>

                    <p>
                        CatholicProjects will remain free to access. We believe
                        Catholic resources created in service to our Lord and
                        Savior Jesus Christ should be available to the people
                        who need them.
                    </p>
                </aside>

                <div className={styles.actions}>
                    <a
                        className={styles.primaryButton}
                        href="https://catholicprojects.org"
                    >
                        <span aria-hidden="true">←</span>
                        Return to CatholicProjects.org
                    </a>

                    <a
                        className={styles.secondaryButton}
                        href="mailto:team@catholicprojects.org"
                    >
                        Contact us
                    </a>
                </div>

                <p className={styles.footerNote}>
                    We&apos;re building carefully. Thank you for your patience
                    while CatholicProjects is in production.
                </p>
            </section>
        </main>
    )
}

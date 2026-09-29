import type { Metadata } from "next"
import Navbar from "../components/Navbar"
import TeacherLanding from "../components/TeacherLanding"

export const metadata: Metadata = {
    title: "CatholicProjects — Saints & Free Resources",
    description:
        "Free, source-linked Catholic resources for families, parishes, catechists, educators, and students — starting with the lives of the Saints.",
    robots: {
        index: false,
        follow: false,
    },
}

export default function HomePage() {
    return (
        <>
            <Navbar currentPage="Home" />
            <main>
                <TeacherLanding />
            </main>
        </>
    )
}

import type { Metadata } from "next"
import HomeClient from "./HomeClient"

export const metadata: Metadata = {
    title: "CatholicProjects — Free Catholic Worksheets",
    description:
        "Free, source-linked Catholic worksheets, coloring pages, and activities by category — for parents, parishes, catechists, educators, and students.",
    robots: {
        index: false,
        follow: false,
    },
}

export default function HomePage() {
    return <HomeClient />
}

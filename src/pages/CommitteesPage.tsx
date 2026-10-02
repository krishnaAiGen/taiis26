import { motion } from "framer-motion"
import { User } from "lucide-react"
import { Breadcrumbs } from "../components/Breadcrumbs"
import { PageHeader } from "../components/PageHeader"
import { MotionSection } from "../components/MotionSection"
import { siteConfig } from "../config/siteConfig"

type CommitteeMember = { name: string; affiliation: string }

function normalizeMemberName(name: string) {
  return name.trim().toLowerCase().replace(/\s+/g, " ")
}

function dedupeMembers(members: CommitteeMember[]) {
  const seen = new Set<string>()
  return members.filter((member) => {
    const key = normalizeMemberName(member.name)
    if (seen.has(key)) return false
    seen.add(key)
    return true
  })
}

function getCommitteeGroupsWithUniqueMembers() {
  const chairNames = new Set<string>()

  return siteConfig.committees.groups.map((group) => {
    let members = dedupeMembers([...group.members])

    if (group.role === "Technical Program Committee") {
      members = members.filter(
        (member) => !chairNames.has(normalizeMemberName(member.name)),
      )
    } else {
      for (const member of members) {
        chairNames.add(normalizeMemberName(member.name))
      }
    }

    return { ...group, members }
  })
}

export function CommitteesPage() {
  const { committees } = siteConfig
  const groups = getCommitteeGroupsWithUniqueMembers()

  return (
    <>
      <Breadcrumbs current={committees.title} />
      <PageHeader title={committees.title} />
      <section className="py-14 sm:py-18">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="space-y-14">
            {groups.map((group, gi) => (
              <MotionSection key={group.role} delay={gi * 0.1}>
                <h2 className="font-serif text-2xl text-primary-950 sm:text-3xl">
                  {group.role}
                </h2>
                <div
                  className={`mt-6 grid gap-4 ${
                    group.role === "Technical Program Committee"
                      ? "sm:grid-cols-2 lg:grid-cols-3"
                      : "sm:grid-cols-2"
                  }`}
                >
                  {group.members.map((member) => (
                    <motion.div
                      key={member.name}
                      initial={{ opacity: 0, y: 12 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: (gi % 9) * 0.04 }}
                      whileHover={{ y: -4 }}
                      className="flex items-start gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition-shadow hover:border-primary-200 hover:shadow-md"
                    >
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary-100 text-primary-600">
                        <User className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900">{member.name}</p>
                        <p className="mt-0.5 text-sm text-slate-500">
                          {member.affiliation}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </MotionSection>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}

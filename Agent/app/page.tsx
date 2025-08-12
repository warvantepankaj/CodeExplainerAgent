"use client"
import { Github, Code2, ChevronRight, Zap, Brain, FileText, Users, Star, GitBranch, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"
import ThemeToggle from "@/components/theme-toggle"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"

export default function Page() {
  const { toast } = useToast()
  const router = useRouter()

  const features = [
    {
      icon: Brain,
      title: "AI-Powered Explanations",
      description: "Advanced language models break down complex code into simple, beginner-friendly explanations.",
      gradient: "from-violet-500 to-purple-600",
    },
    {
      icon: GitBranch,
      title: "GitHub Integration",
      description:
        "Seamlessly connect to any public GitHub repository and explore codebases with intelligent navigation.",
      gradient: "from-blue-500 to-cyan-600",
    },
    {
      icon: Zap,
      title: "Multi-Language Support",
      description: "Supports Java, C, C++, and Python with smart language detection and syntax highlighting.",
      gradient: "from-indigo-500 to-blue-600",
    },
    {
      icon: FileText,
      title: "Interactive Code Explorer",
      description: "Browse file trees, view code with syntax highlighting, and get contextual explanations instantly.",
      gradient: "from-emerald-500 to-teal-600",
    },
  ]

  const stats = [
    { label: "Languages Supported", value: "4+", icon: Code2 },
    { label: "GitHub Integration", value: "✓", icon: GitBranch },
    { label: "AI Explanations", value: "∞", icon: Brain },
    { label: "Open Source", value: "✓", icon: Users },
  ]

  return (
    <main className="min-h-[100dvh] bg-background text-foreground">
      {/* Header */}
      <header className="border-b sticky top-0 z-40 bg-background/80 backdrop-blur">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="size-8 rounded-md bg-gradient-to-br from-violet-600 to-blue-600 shadow-sm" />
            <div className="flex flex-col leading-tight">
              <span className="font-semibold tracking-tight">Code Explainer</span>
              <span className="text-xs text-muted-foreground">GitHub repos • Java • C • C++ • Python</span>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-2">
            <a
              href="https://github.com"
              target="_blank"
              rel="noreferrer"
              className={cn(
                "inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors",
              )}
            >
              <Github className="size-4" />
              <span>{"Star on GitHub"}</span>
            </a>
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Royal hero section */}
      <section className="relative overflow-hidden">
        {/* Gradient background decorations */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-violet-500/25 blur-3xl" />
          <div className="absolute -bottom-20 -right-24 h-72 w-72 rounded-full bg-blue-500/25 blur-3xl" />
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-violet-500/40 to-transparent" />
        </div>

        {/* Make hero always at least full viewport height so functionality is only visible on scroll */}
        <div className="container mx-auto px-4 min-h-[100dvh] py-12 md:py-16 flex flex-col items-center justify-center text-center">
          <div className="mx-auto max-w-3xl">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, ease: "easeOut", delay: 0.0 }}
              className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs text-muted-foreground bg-background/60 backdrop-blur-sm"
            >
              <span className="size-1.5 rounded-full bg-gradient-to-r from-violet-500 to-blue-500" />
              Explain any repo or snippet in plain English
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: "easeOut", delay: 0.06 }}
              className="mt-4 text-3xl md:text-5xl font-semibold tracking-tight"
            >
              Understand code faster with
              <span className="bg-gradient-to-r from-violet-600 to-blue-600 bg-clip-text text-transparent">
                {" smart explanations"}
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: "easeOut", delay: 0.12 }}
              className="mt-4 text-muted-foreground md:text-lg"
            >
              Paste Java, C, C++, or Python code—or link a GitHub repo—to get clear, beginner‑friendly explanations.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: "easeOut", delay: 0.18 }}
              className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3"
            >
              <Button
                size="lg"
                className="w-full sm:w-auto bg-gradient-to-r from-violet-600 to-blue-600 text-white hover:from-violet-700 hover:to-blue-700"
                onClick={() => router.push("/explainer?tab=repo")}
                aria-label="Use GitHub repo"
              >
                <Github className="mr-2 size-4" />
                Use GitHub repo
                <ChevronRight className="ml-2 size-4" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="w-full sm:w-auto border-violet-300/60 dark:border-violet-900/40 bg-transparent"
                onClick={() => router.push("/explainer?tab=paste")}
                aria-label="Paste code"
              >
                <Code2 className="mr-2 size-4" />
                Paste code
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: "easeOut", delay: 0.26 }}
              className="mt-10 flex items-center justify-center gap-4 text-xs text-muted-foreground"
            >
              <span className="inline-flex items-center gap-1">
                <span className="size-1.5 rounded-full bg-violet-500" />
                Java
              </span>
              <span className="inline-flex items-center gap-1">
                <span className="size-1.5 rounded-full bg-blue-500" />C / C++
              </span>
              <span className="inline-flex items-center gap-1">
                <span className="size-1.5 rounded-full bg-indigo-500" />
                Python
              </span>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Badge variant="secondary" className="mb-4">
              <Zap className="size-3 mr-1" />
              Hackathon Ready
            </Badge>
            <h2 className="text-2xl md:text-4xl font-bold mb-4">
              Built for developers,{" "}
              <span className="bg-gradient-to-r from-violet-600 to-blue-600 bg-clip-text text-transparent">
                by developers
              </span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              A modern platform that combines cutting-edge AI with intuitive design to make code comprehension
              effortless for everyone.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full border-0 bg-background/60 backdrop-blur-sm hover:bg-background/80 transition-all duration-300 group">
                  <CardHeader className="pb-2">
                    <div
                      className={cn(
                        "size-12 rounded-lg bg-gradient-to-br flex items-center justify-center mb-3",
                        feature.gradient,
                      )}
                    >
                      <feature.icon className="size-6 text-white" />
                    </div>
                    <CardTitle className="text-lg group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors">
                      {feature.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="inline-flex items-center justify-center size-12 rounded-full bg-gradient-to-br from-violet-500/20 to-blue-500/20 mb-3">
                  <stat.icon className="size-6 text-violet-600 dark:text-violet-400" />
                </div>
                <div className="text-2xl font-bold bg-gradient-to-r from-violet-600 to-blue-600 bg-clip-text text-transparent">
                  {stat.value}
                </div>
                <div className="text-xs text-muted-foreground">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-background border-t">
        <div className="container mx-auto px-4 py-12">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            {/* Brand */}
            <div className="md:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <div className="size-10 rounded-lg bg-gradient-to-br from-violet-600 to-blue-600 shadow-lg" />
                <div>
                  <div className="font-bold text-lg">Code Explainer</div>
                  <div className="text-xs text-muted-foreground">Hackathon Project 2025</div>
                </div>
              </div>
              <p className="text-sm text-muted-foreground mb-4 max-w-md">
                An innovative platform that transforms complex codebases into understandable explanations. Built with
                Next.js, AI SDK, and modern web technologies for hackathon submission.
              </p>
              <div className="flex items-center gap-4">
                <Badge variant="secondary" className="text-xs">
                  <Star className="size-3 mr-1" />
                  Innovation Project
                </Badge>
                <Badge variant="outline" className="text-xs">
                  <Clock className="size-3 mr-1" />
                  Rapid Development
                </Badge>
              </div>
            </div>

            {/* Tech Stack */}
            <div>
              <h3 className="font-semibold mb-3">Tech Stack</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>Next.js 15</li>
                <li>TypeScript</li>
                <li>Tailwind CSS</li>
                <li>shadcn/ui</li>
                <li>AI SDK</li>
                <li>Framer Motion</li>
              </ul>
            </div>

            {/* Links */}
            <div>
              <h3 className="font-semibold mb-3">Project</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a href="https://github.com" className="hover:text-foreground transition-colors">
                    Source Code
                  </a>
                </li>
                <li>
                  <a href="/explainer" className="hover:text-foreground transition-colors">
                    Live Demo
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    Project Docs
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    Presentation
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom */}
          <div className="border-t pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-xs text-muted-foreground">
              © 2025 Code Explainer. Built with ❤️ for hackathon submission.
            </div>
            <div className="flex items-center gap-4">
              <a
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <Github className="size-4" />
              </a>
              <div className="md:hidden">
                <ThemeToggle />
              </div>
            </div>
          </div>
        </div>
      </footer>
    </main>
  )
}

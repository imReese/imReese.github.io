export type ProfileSummary = {
  name: string
  headline: string
  introduction: string
  location: string
  email: string
  githubUsername: string
  focusAreas: string[]
  aboutParagraphs: string[]
}

export type CurrentFocus = {
  eyebrow: string
  title: string
  summary: string
  bullets: string[]
  links: Array<{ label: string; href: string }>
}

export type ImpactStat = {
  value: string
  label: string
  detail: string
}

export type ExperienceHighlight = {
  company: string
  team: string
  title: string
  start: string
  end: string
  logo: string
  highlights: string[]
}

export type EducationHighlight = {
  school: string
  major: string
  start: string
  end: string
  logo: string
  details: string[]
}

export type ProjectHighlight = {
  name: string
  description: string
  href: string
  label: string
  tags: string[]
}

export type StackGroup = {
  title: string
  items: string[]
}

export const profileSummary: ProfileSummary = {
  name: "Reese",
  headline: "Inference engines for LLM serving and backend systems.",
  introduction:
    "I'm Reese, a Beijing-based systems engineer working on inference engine performance for large-model serving, with experience across SGLang runtime infrastructure, heterogeneous accelerator optimization, distributed storage, and Linux performance analysis.",
  location: "Beijing, China",
  email: "reese_duan@outlook.com",
  githubUsername: "imReese",
  focusAreas: [
    "Inference Engine",
    "LLM Serving",
    "GPU Optimization",
    "Kunlunxin P-series",
    "SGLang",
    "Backend Systems",
  ],
  aboutParagraphs: [
    "I build backend systems where reliability, performance, and operational clarity matter.",
    "My current work focuses on inference engine performance for large-model serving, including runtime paths, backend execution, and heterogeneous accelerator optimization across NVIDIA GPUs and Kunlunxin P-series accelerators.",
    "I also work on SGLang's Rust runtime direction: request lifecycle, scheduler/router boundaries, gRPC protocols, tokenization edges, and PD-style KV transfer planning.",
    "Before that I worked on distributed storage cluster management and CPU microarchitecture performance analysis at Huawei, which shaped how I debug systems from product behavior down to instruction-level traces.",
  ],
}

export const currentFocus: CurrentFocus = {
  eyebrow: "Current focus",
  title: "Inference engine performance",
  summary:
    "I work on inference engine optimization for large-model serving at Baidu AI Computing Department, focusing on runtime behavior and backend performance across NVIDIA GPUs and Kunlunxin P-series accelerators.",
  bullets: [
    "Analyze throughput, latency, memory efficiency, and runtime bottlenecks in production-oriented inference workloads.",
    "Tune execution paths around kernels, operators, scheduling, and backend dispatch for heterogeneous accelerators.",
    "Work across NVIDIA GPU and Kunlunxin P-series accelerator paths while keeping device-specific details behind clear runtime boundaries.",
    "Carry SGLang runtime experience into serving-system design: request lifecycle, scheduling, KV cache, and transfer boundaries.",
  ],
  links: [
    { label: "sglang-rs", href: "https://github.com/imReese/sglang-rs" },
    { label: "Projects", href: "/projects" },
  ],
}

export const impactStats: ImpactStat[] = [
  {
    value: "NVIDIA + P-series",
    label: "accelerators",
    detail: "Optimize inference paths across GPU and Kunlunxin accelerator backends.",
  },
  {
    value: "latency / throughput",
    label: "serving metrics",
    detail: "Focus on practical performance signals for large-model serving systems.",
  },
  {
    value: "runtime + kernels",
    label: "engine layers",
    detail: "Investigate bottlenecks across scheduling, operators, kernels, and memory paths.",
  },
  {
    value: "128 -> 256",
    label: "cluster scale",
    detail: "Expanded distributed storage cluster initialization capacity.",
  },
  {
    value: "+40%",
    label: "init efficiency",
    detail: "Improved cluster startup path through async queues and module decoupling.",
  },
  {
    value: "90%+",
    label: "branch coverage",
    detail: "Built DTFuzz interface tests to block high-risk storage defects.",
  },
  {
    value: "+30%",
    label: "TLB hit rate",
    detail: "Validated a dynamic TLB scheduling approach with ChampSim.",
  },
  {
    value: "+6%",
    label: "IPC",
    detail: "Measured instruction-level architecture gains in CPU simulation.",
  },
  {
    value: "+8%",
    label: "throughput",
    detail: "Helped tune SMT strategy on Kunpeng CPU workloads.",
  },
]

export const experienceHighlights: ExperienceHighlight[] = [
  {
    company: "Baidu",
    team: "AI Computing Department",
    title: "Software Engineer, Inference Engine",
    logo: "cpu",
    start: "2025.06.30",
    end: "Present",
    highlights: [
      "Work on inference engine performance for large-model serving systems.",
      "Optimize runtime and backend paths across NVIDIA GPUs and Kunlunxin P-series accelerators.",
      "Investigate bottlenecks across kernels, operators, scheduling, memory behavior, and execution paths.",
    ],
  },
  {
    company: "Huawei Cloud Computing",
    team: "Shuhai Lab",
    title: "Computer Architecture Research Engineer",
    logo: "cpu",
    start: "2023.07",
    end: "2024.07",
    highlights: [
      "Used perf and Intel Pin to build low-overhead instruction-flow analysis for MySQL and Redis-style workloads.",
      "Validated a dynamic TLB scheduling algorithm in ChampSim, improving simulated TLB hit rate and IPC.",
      "Worked with HiSilicon and openEuler teams on Kunpeng CPU SMT tuning and microcode-level performance improvement.",
    ],
  },
  {
    company: "Huawei Data Storage",
    team: "Infrastructure Development",
    title: "Software Development Engineer",
    logo: "database",
    start: "2022.05",
    end: "2023.07",
    highlights: [
      "Built distributed high-availability and cluster-management paths around leader election and Paxos-based coordination.",
      "Decoupled initialization modules with async queues, raising supported node scale from 128 to 256.",
      "Added DTFuzz coverage for 200+ interfaces and hardened command execution paths with input filtering and sandboxing.",
    ],
  },
]

export const educationHighlights: EducationHighlight[] = [
  {
    school: "Nanjing University",
    major: "B.Eng. Environmental Engineering",
    logo: "college",
    start: "2017.09",
    end: "2021.06",
    details: [
      "GPA 4.2 / 5.0.",
      "Computer organization, data structures, operating systems, networks, computer architecture, linear algebra, probability and statistics, and algorithm design.",
    ],
  },
]

export const projectHighlights: ProjectHighlight[] = [
  {
    name: "SGLang Rust Runtime",
    description:
      "Rust runtime direction for SGLang covering request lifecycle, scheduler/router boundaries, gRPC contracts, tokenizer edges, cache management, and PD KV transfer planning.",
    href: "https://github.com/imReese/sglang-rs",
    label: "github.com/imReese/sglang-rs",
    tags: ["Rust", "SGLang", "LLM Serving", "gRPC", "Scheduling"],
  },
  {
    name: "Lightweight C++ Web Server",
    description:
      "C++ web server using thread pools, non-blocking sockets, epoll, HTTP state machines, database-backed login/register flow, and sync/async logging.",
    href: "https://github.com/imReese",
    label: "github.com/imReese",
    tags: ["C++", "Linux", "epoll", "HTTP", "MySQL"],
  },
  {
    name: "LeetCode Automation Manager",
    description:
      "Automation that parses problem statements, generates descriptions, code templates, tests, and GitHub Actions workflows for algorithm practice.",
    href: "https://github.com/imReese",
    label: "github.com/imReese",
    tags: ["Python", "C++", "Automation", "GitHub Actions"],
  },
]

export const stackGroups: StackGroup[] = [
  { title: "Languages", items: ["Rust", "C/C++", "Go", "Python", "Shell", "TypeScript"] },
  { title: "Systems", items: ["Linux", "gRPC", "Paxos", "epoll", "perf", "Intel Pin", "gdb"] },
  { title: "Infrastructure", items: ["Docker", "Kubernetes", "Redis", "MySQL", "Prometheus", "Grafana"] },
]

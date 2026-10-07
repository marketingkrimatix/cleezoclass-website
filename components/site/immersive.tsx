"use client";
import { useEffect, useRef, useState } from "react";
import homepage from "@/content/homepage.json";
import connectionStyles from "./connection-map.module.css";
import Link from "next/link";
import { usePathname } from "next/navigation";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  Bell,
  BookOpen,
  Bus,
  CalendarDays,
  Check,
  CheckCheck,
  Clock3,
  FileCheck,
  Heart,
  LayoutDashboard,
  Library,
  MessageSquare,
  NotebookPen,
  School,
  Send,
  ShieldCheck,
  Sparkles,
  Users,
  Wallet,
} from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Action, Eyebrow, TextLink } from "./ui";
import { ProductCanvas } from "./product";
import { useMotionDisabled } from "./motion";
import { homeModules, homeRoles as roles, attendanceSteps, automationExamples } from "@/content/home-experience";
import { resources } from "@/content/resources";

const icons = [
  CalendarDays,
  BookOpen,
  FileCheck,
  MessageSquare,
  Wallet,
  Bus,
  Users,
  Heart,
  Library,
];
const tabNames = ["Admissions", "Attendance", "Academics", "Communication"];
export function ImmersiveMotion() {
  const path = usePathname();
  const disabled = useMotionDisabled();
  const cursor = useRef<HTMLDivElement>(null);
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    if (disabled) return;
    const ctx = gsap.context(() => {
      const media = gsap.matchMedia();
      media.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.to(".reading-progress", {
          scaleX: 1,
          ease: "none",
          scrollTrigger: { start: 0, end: "max", scrub: true },
        });
        gsap.utils
          .toArray<HTMLElement>("[data-reveal]")
          .forEach((el, i) =>
            gsap.fromTo(
              el,
              { y: i % 2 ? 36 : 0, x: i % 2 ? 0 : 24, opacity: 0.35 },
              {
                y: 0,
                x: 0,
                opacity: 1,
                duration: 0.8,
                ease: "power3.out",
                scrollTrigger: { trigger: el, start: "top 90%", once: true },
              },
            ),
          );
        gsap.utils
          .toArray<HTMLElement>(".workflow-stop")
          .forEach((el) =>
            ScrollTrigger.create({
              trigger: el,
              start: "top 65%",
              onEnter: () => el.classList.add("reached"),
              onLeaveBack: () => el.classList.remove("reached"),
            }),
          );
        gsap.fromTo(
          ".workflow-route",
          { strokeDashoffset: 1 },
          {
            strokeDashoffset: 0,
            ease: "none",
            scrollTrigger: {
              trigger: ".pathway",
              start: "top center",
              end: "bottom 70%",
              scrub: true,
            },
          },
        );
        gsap.utils
          .toArray<HTMLElement>(".ecosystem-module")
          .forEach((el, i) =>
            gsap.from(el, {
              y: 50,
              rotate: i % 2 ? 4 : -4,
              opacity: 0.2,
              duration: 0.8,
              scrollTrigger: { trigger: el, start: "top 94%", once: true },
            }),
          );
        gsap.from(".demo-devices>div", {
          y: 90,
          rotate: 4,
          opacity: 0.3,
          stagger: 0.15,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".demo-devices",
            start: "top 85%",
            once: true,
          },
        });
      });
      media.add(
        "(min-width: 1000px) and (prefers-reduced-motion: no-preference)",
        () => {
          const scatter = document.querySelector(".gather-scene");
          if (scatter) {
            const cards = gsap.utils.toArray<HTMLElement>(".scatter-card");
            gsap.to(cards, {
              x: 0,
              y: 0,
              rotation: 0,
              scale: 0.6,
              opacity: 0,
              ease: "power2.inOut",
              stagger: 0.025,
              scrollTrigger: {
                trigger: ".gather-track",
                start: "top top",
                end: "75% bottom",
                scrub: 0.5,
              },
            });
            gsap.fromTo(
              ".gather-dashboard",
              { scale: 0.78, opacity: 0.1, y: 60 },
              {
                scale: 1,
                opacity: 1,
                y: 0,
                scrollTrigger: {
                  trigger: ".gather-track",
                  start: "top top",
                  end: "bottom bottom",
                  scrub: 0.5,
                },
              },
            );
          }
        },
      );
    });
    const visibility = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          (e.target as HTMLElement).dataset.motionVisible = String(
            e.isIntersecting,
          );
        }),
      { rootMargin: "100px" },
    );
    document
      .querySelectorAll("main>section")
      .forEach((el) => visibility.observe(el));
    const fine = matchMedia("(hover:hover) and (pointer:fine)").matches;
    let frame = 0;
    const pointer = (e: PointerEvent) => {
      if (!fine) return;
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        if (cursor.current) {
          cursor.current.style.left = e.clientX + "px";
          cursor.current.style.top = e.clientY + "px";
          const target = (e.target as Element).closest(
            "a,button,[data-cursor]",
          );
          cursor.current.classList.toggle("cursor-active", !!target);
          cursor.current.textContent =
            (target as HTMLElement)?.dataset.cursor || "";
        }
        const magnetic = (e.target as Element).closest<HTMLElement>(
          ".hero-actions .button,.site-header .desktop-nav a",
        );
        if (magnetic) {
          const r = magnetic.getBoundingClientRect();
          magnetic.style.translate =
            (e.clientX - r.left - r.width / 2) * 0.06 +
            "px " +
            (e.clientY - r.top - r.height / 2) * 0.08 +
            "px";
          magnetic.onpointerleave = () => {
            magnetic.style.translate = "0px 0px";
          };
        }
        const stage = (e.target as Element).closest<HTMLElement>(".hero-depth");
        if (stage) {
          const r = stage.getBoundingClientRect();
          stage.style.setProperty(
            "--rx",
            ((e.clientY - r.top - r.height / 2) / r.height) * -5 + "deg",
          );
          stage.style.setProperty(
            "--ry",
            ((e.clientX - r.left - r.width / 2) / r.width) * 7 + "deg",
          );
        }
      });
    };
    document.addEventListener("pointermove", pointer, { passive: true });
    return () => {
      ctx.revert();
      visibility.disconnect();
      document
        .querySelectorAll("[data-motion-visible]")
        .forEach((el) => el.removeAttribute("data-motion-visible"));
      cancelAnimationFrame(frame);
      document.removeEventListener("pointermove", pointer);
    };
  }, [disabled, path]);
  return (
    <>
      <div className="reading-progress" aria-hidden="true" />
      <div
        ref={cursor}
        className={`focus-cursor ${disabled ? "off" : ""}`}
        aria-hidden="true"
      />
    </>
  );
}

export function ExperienceHero() {
  return (
    <section className="experience-hero">
      <div className="hero-grid wrap">
        <div className="hero-editorial">
          <Eyebrow>{homepage.hero.eyebrow}</Eyebrow>
          <h1><span className="headline-mask"><span>School Management Software</span></span><span className="headline-mask"><span> for K–12 and <em>Multi-Branch Schools</em></span></span></h1>
          <p>{homepage.hero.description}</p>
          <div className="hero-actions">
            <Action>{homepage.hero.primary}</Action>
            <Action href="#connections" secondary>{homepage.hero.secondary}</Action>
          </div>
          <a className="hero-scroll" href="#connections"><span><ArrowDown size={16}/></span>From enquiry to report card</a>
        </div>
        <div className="hero-depth" data-cursor="View">
          <div className="hero-halo" />
          <div className="hero-orbit orbit-one" />
          <div className="hero-orbit orbit-two" />
          <div className="hero-app">
            <div className="hero-app-label">
              <span>
                <School size={16} /> YOUR SCHOOL, IN SYNC
              </span>
              <span>Illustrative preview · 08:30</span>
            </div>
            <ProductCanvas homepage mode={5} />
          </div>
          <div className="activity-card activity-attendance">
            <span className="activity-icon">
              <CheckCheck size={23} />
            </span>
            <div>
              <small>Biometric / RFID</small>
              <strong>Attendance recorded</strong>
              <span>Class 6A · Ready to review</span>
            </div>
          </div>
          <div className="activity-card activity-lesson">
            <span className="activity-icon orange-icon">
              <BookOpen size={22} />
            </span>
            <div>
              <small>Up next · 10:30</small>
              <strong>Weekly timetable</strong>
              <span>Teacher availability in view</span>
            </div>
            <span className="lesson-clock">
              <Clock3 size={18} />
            </span>
          </div>
          <div className="activity-card activity-message">
            <span className="activity-icon">
              <MessageSquare size={21} />
            </span>
            <div>
              <small>Parents, kept in the loop</small>
              <strong>Fee receipts and alerts</strong>
              <span>Official school WhatsApp</span>
            </div>
          </div>
          <div className="floating-school-icon float-bell">
            <Bell size={27} />
          </div>
          <div className="floating-school-icon float-book">
            <NotebookPen size={28} />
          </div>
        </div>
      </div>
      <div className="hero-foot wrap"><p>{homepage.hero.strip}</p></div>
    </section>
  );
}

const connections = [
  {
    label: "Front desk",
    icon: BookOpen,
    action: "Captures an enquiry",
    className: "teacher-node",
  },
  {
    label: "Accounts",
    icon: CalendarDays,
    action: "Sets fees and issues receipts",
    className: "admin-node",
  },
  {
    label: "Teachers",
    icon: MessageSquare,
    action: "Manage exams and report cards.",
    className: "parent-node",
  },
  {
    label: "School leader",
    icon: LayoutDashboard,
    action: "Reviews operations and finance",
    className: "leader-node",
  },
];
export function ConnectionMap() {
  const [active, setActive] = useState(0);
  const mapRef = useRef<HTMLDivElement>(null);
  const [wires, setWires] = useState({
    width: 1,
    height: 1,
    paths: [] as string[],
  });
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    const measure = () => {
      const hub = map.querySelector<HTMLElement>(".connection-hub");
      if (!hub) return;
      const hx = hub.offsetLeft + hub.offsetWidth / 2,
        hy = hub.offsetTop + hub.offsetHeight / 2;
      const paths = Array.from(
        map.querySelectorAll<HTMLElement>(".connection-node"),
      ).map((node) => {
        const x = node.offsetLeft + node.offsetWidth / 2,
          y = node.offsetTop + node.offsetHeight / 2;
        const mid = (y + hy) / 2;
        return (
          "M" +
          x +
          " " +
          y +
          " C" +
          x +
          " " +
          mid +
          " " +
          hx +
          " " +
          mid +
          " " +
          hx +
          " " +
          hy
        );
      });
      setWires({ width: map.clientWidth, height: map.clientHeight, paths });
    };
    const observer = new ResizeObserver(measure);
    observer.observe(map);
    map
      .querySelectorAll(".connection-node,.connection-hub")
      .forEach((el) => observer.observe(el));
    measure();
    return () => observer.disconnect();
  }, []);
  const disabled = useMotionDisabled();
  const root = useRef<HTMLElement>(null);
  useEffect(() => {
    if (disabled) return;
    let timer: ReturnType<typeof setInterval> | undefined;
    const observer = new IntersectionObserver(
      ([entry]) => {
        clearInterval(timer);
        if (entry.isIntersecting)
          timer = setInterval(() => setActive((v) => (v + 1) % 4), 2600);
      },
      { threshold: 0.35 },
    );
    if (root.current) observer.observe(root.current);
    return () => {
      clearInterval(timer);
      observer.disconnect();
    };
  }, [disabled]);
  return (
    <section
      ref={root}
      className={`connections-section section wrap ${connectionStyles.diagram}`}
      id="connections"
    >
      <div className="section-heading">
        <h2>{homepage.sections[0].title}</h2>
        <div className="homepage-flow-copy">{homepage.sections[0].paragraphs.map(text => <p key={text}>{text}</p>)}<TextLink href="#modules">See the core modules</TextLink></div>
      </div>
      <div ref={mapRef} className={`connection-map connection-step-${active}`}>
        <svg
          className={connectionStyles.mobileWires}
          viewBox={`0 0 ${wires.width} ${wires.height}`}
          aria-hidden="true"
        >
          {wires.paths.map((d, i) => (
            <path
              key={i}
              d={d}
              className={active === i ? connectionStyles.activeWire : undefined}
            />
          ))}
        </svg>
        <svg
          viewBox="0 0 1000 350"
          preserveAspectRatio="none"
          className="connection-wires"
          aria-hidden="true"
        >
          <path d="M140 80 C330 80 290 175 500 175 S710 80 860 80 M140 280 C330 280 290 175 500 175 S710 280 860 280" />
          <path
            className="wire-signal"
            d="M140 80 C330 80 290 175 500 175 S710 280 860 280"
          />
          <circle r="5" fill="#F36D22">
            <animateMotion
              dur="7s"
              repeatCount="indefinite"
              path="M140 80 C330 80 290 175 500 175 S710 280 860 280"
            />
          </circle>
        </svg>
        <div className="connection-hub">
          <img
            src="/cleezo-logo.png"
            width="52"
            height="55"
            alt="Cleezo Class"
          />
          <strong>
            One connected
            <br />
            school record.
          </strong>
          <span>Information that flows.</span>
        </div>
        {connections.map((n, i) => (
          <button
            className={`connection-node ${n.className} ${active === i ? "node-active" : ""}`}
            key={n.label}
            onClick={() => setActive(i)}
            aria-pressed={active === i}
          >
            <span className="node-icon">
              <n.icon size={24} />
            </span>
            <span>
              <strong>{n.label}</strong>
              <small>{n.action}</small>
            </span>
            <ArrowUpRight size={17} />
          </button>
        ))}
        <div className="travelling-update" key={active}>
          <Check size={15} />
          {connections[active].action}
        </div>
      </div>
      <p className="connection-caption">
        <span>Front desk captures enquiry</span>
        <ArrowRight size={14} aria-hidden="true" />
        <span>Accounts sets fees</span>
        <ArrowRight size={14} aria-hidden="true" />
        <span>Teachers publish report cards</span>
        <ArrowRight size={14} aria-hidden="true" />
        <span>Leadership reviews</span>
      </p>
    </section>
  );
}

export function PlatformPreview() {
  const [tab, setTab] = useState("0");
  return (
    <section id="platform-preview" className="preview-section section">
      <div className="wrap">
        <div className="section-heading">
          <div>
            <Eyebrow>Connected, role-based workspaces</Eyebrow>
            <h2>Admissions, attendance, academics and parent updates.</h2>
          </div>
          <p>Follow enquiries, review supported biometric and RFID attendance, prepare examinations and keep parents informed.</p>
        </div>
        <Tabs value={tab} onValueChange={setTab} className="platform-tabs">
          <TabsList aria-label="Product preview" className="product-tab-list">
            {tabNames.map((t, i) => (
              <TabsTrigger value={String(i)} key={t}>
                {t}
                <span className="tab-number">0{i + 1}</span>
              </TabsTrigger>
            ))}
          </TabsList>
          {tabNames.map((t, i) => (
            <TabsContent value={String(i)} key={t} className="product-panel">
              <ProductCanvas homepage mode={i} />
            </TabsContent>
          ))}
        </Tabs>
        <p className="preview-caption">
          An illustrative preview with sample records. Explore your school’s
          exact configuration in a demo.
        </p>
      </div>
    </section>
  );
}

const checkpoints = [
  [
    "Admissions CRM\n& enrolment",
    "Capture enquiries and\nenrol accepted applicants.",
    "Enquiry tracking",
    "Student records"
  ],
  [
    "Fee collection\n& accounting",
    "Set class-wise fees and\nissue branded receipts.",
    "QR-verifiable receipts",
    "Approved concessions"
  ],
  [
    "Academics\n& examinations",
    "Plan classes and exams;\npublish report cards.",
    "Hall tickets",
    "Report cards"
  ],
  [
    "Parent\ncommunication",
    "Share receipts, alerts\nand school updates.",
    "Official WhatsApp",
    "Parent access"
  ]
];
export function ConnectedPathway() {
  const pathwayRef = useRef<HTMLDivElement>(null);
  const [wave, setWave] = useState({ width: 1100, height: 150, path: "" });
  useEffect(() => {
    const pathway = pathwayRef.current;
    if (!pathway) return;
    const measure = () => {
      const svg = pathway.querySelector<SVGSVGElement>(".pathway-svg");
      if (!svg || getComputedStyle(svg).display === "none") return;
      const bounds = svg.getBoundingClientRect();
      if (!bounds.width || !bounds.height) return;
      const points = Array.from(pathway.querySelectorAll(".stop-marker")).map(
        (marker) => {
          const box = marker.getBoundingClientRect();
          return {
            x: box.left + box.width / 2 - bounds.left,
            y: box.top + box.height / 2 - bounds.top,
          };
        },
      );
      if (points.length < 2) return;
      let path = "M" + points[0].x + " " + points[0].y;
      const stops = [
        ...points,
        { x: bounds.width, y: points[points.length - 1].y },
      ];
      for (let i = 1; i < stops.length; i++) {
        const a = stops[i - 1],
          b = stops[i],
          dx = b.x - a.x;
        const amplitude = Math.min(48, dx * 0.2) * (i % 2 ? -1 : 1);
        path +=
          " C" +
          (a.x + dx / 3) +
          " " +
          (a.y + amplitude) +
          " " +
          (b.x - dx / 3) +
          " " +
          (b.y + amplitude) +
          " " +
          b.x +
          " " +
          b.y;
      }
      setWave({ width: bounds.width, height: bounds.height, path });
    };
    const observer = new ResizeObserver(measure);
    observer.observe(pathway);
    pathway
      .querySelectorAll(".stop-marker,.workflow-stop")
      .forEach((el) => observer.observe(el));
    window.addEventListener("resize", measure);
    measure();
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, []);
  return (
    <section className="pathway-section section wrap">
      <Eyebrow>Every handover, connected</Eyebrow>
      <h2>From first enquiry<br/>to report card.</h2>
      <div ref={pathwayRef} className="pathway">
        <svg
          className="pathway-svg"
          viewBox={`0 0 ${wave.width} ${wave.height}`}
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path d={wave.path} />
          <path className="workflow-route" pathLength="1" d={wave.path} />
        </svg>
        {checkpoints.map(([title, body, a, b], i) => {
          const Icon = icons[[0, 1, 4, 3][i]];
          return (
            <article className="workflow-stop" key={title}>
              <span className="stop-marker">0{i + 1}</span>
              <Icon size={28} />
              <h3>{title.split("\n").map(line => <span className="workflow-copy-line" key={line}>{line}</span>)}</h3>
              <p>{body.split("\n").map(line => <span className="workflow-copy-line" key={line}>{line}</span>)}</p>
              <div className="workflow-chips">
                <span>{a}</span>
                <span>{b}</span>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

const looseCards = [
  ["Spreadsheet", FileCheck, -390, -110, -13],
  ["Attendance register", CalendarDays, -420, 80, 8],
  ["Parent message", MessageSquare, 350, -140, 12],
  ["Fee record", Wallet, 410, 70, -8],
  ["Report card", BookOpen, -240, 200, 9],
  ["Timetable", Clock3, 200, 220, -12],
  ["WhatsApp update", Bell, 20, -200, 6],
  ["Student record", Users, 400, 220, 8],
] as const;
export function GatherWorkspace() {
  return (
    <section className="gather-track">
      <div className="gather-scene">
        <div className="wrap">
          <div className="gather-heading">
            <Eyebrow>One connected school record</Eyebrow>
            <h2>{homepage.sections[3].title}</h2>
            <p>{homepage.sections[3].cards[0].paragraphs[0]}</p>
          </div>
          <div className="gather-art">
            <div className="gather-dashboard">
              <ProductCanvas homepage mode={5} compact />
              <span className="gather-result">
                <CheckCheck size={20} /> Role-based workspaces. Multi-branch centralisation.
              </span>
            </div>
            {looseCards.map(([label, Icon, x, y, r]) => (
              <div
                key={label}
                className="scatter-card"
                style={{
                  transform: `translate(${x}px,${y}px) rotate(${r}deg)`,
                }}
              >
                <Icon size={24} />
                <span>{label}</span>
                <span className="scatter-rule" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

const dayStages = [
  {
    "time": "08:30",
    "label": "Attendance and HR",
    "title": "Synchronise the school day.",
    "body": "Bring in student and staff attendance from supported biometric or RFID devices. Track late or irregular attendance and leave workflows.",
    "mode": 1
  },
  {
    "time": "10:30",
    "label": "Academics and examinations",
    "title": "Coordinate classes and exams.",
    "body": "Manage timetables, substitute allocations, seating plans and hall tickets. Publish report cards with marks, attendance and performance trends.",
    "mode": 2
  },
  {
    "time": "13:00",
    "label": "Accounts and operations",
    "title": "Review collections and dues.",
    "body": "Record cash, UPI, cheque or bank-transfer payments. Issue QR-verifiable receipts and review outstanding fees, expenses and ledgers.",
    "mode": 4
  },
  {
    "time": "15:30",
    "label": "Parent communication",
    "title": "Keep families informed.",
    "body": "Give parents access to fee status, digital report cards and event updates. Send receipts and attendance alerts through the school’s official WhatsApp number.",
    "mode": 3
  }
];
export function SchoolDayTimeline() {
  const root = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);
  const [hours, minutes] = dayStages[active].time.split(":").map(Number);
  const hourAngle = (hours % 12) * 30 + minutes * 0.5;
  const minuteAngle = minutes * 6;
  const disabled = useMotionDisabled();
  useEffect(() => {
    if (disabled) return;
    gsap.registerPlugin(ScrollTrigger);
    const media = gsap.matchMedia();
    media.add("(min-width:1000px)", () => {
      const trigger = ScrollTrigger.create({
        trigger: root.current,
        start: "top top",
        end: "bottom bottom",
        onUpdate: (s) => setActive(Math.min(3, Math.floor(s.progress * 4))),
      });
      return () => trigger.kill();
    });
    return () => media.revert();
  }, [disabled]);
  const scene = (i: number) => {
    const s = dayStages[i];
    return (
      <div className="day-scene" key={s.time}>
        <div className="day-scene-copy">
          <span className="day-large-time">
            {s.time}
            <small>{s.label}</small>
          </span>
          <h3>{s.title}</h3>
          <p>{s.body}</p>
          <span className="day-task">
            <CheckCheck size={18} />
            {
              [
                "Device attendance reviewed",
                "Academic records prepared",
                "Collections and dues reviewed",
                "Families informed",
              ][i]
            }
          </span>
        </div>
        <div className="day-product">
          <ProductCanvas homepage mode={s.mode} />
        </div>
      </div>
    );
  };
  return (
    <section
      ref={root}
      className={`day-timeline ${disabled ? "day-static" : ""}`}
      id="school-day"
    >
      <div className="day-sticky wrap">
        <div className="day-top">
          <div>
            <Eyebrow>One connected school day</Eyebrow>
            <h2>School operations, academics<br/>and finance, connected.</h2>
          </div>
          <div className="school-clock" aria-hidden="true">
            <svg
              className="clock-face"
              viewBox="0 0 100 100"
              aria-hidden="true"
            >
              <circle cx="50" cy="50" r="44" fill="none" />
              {Array.from({ length: 12 }, (_, i) => (
                <line
                  key={i}
                  x1="50"
                  y1="10"
                  x2="50"
                  y2={i % 3 === 0 ? 18 : 14}
                  transform={`rotate(${i * 30} 50 50)`}
                />
              ))}
            </svg>
            <span
              className="clock-hand clock-hour"
              style={{ transform: `rotate(${hourAngle}deg)` }}
            />
            <span
              className="clock-hand clock-minute"
              style={{ transform: `rotate(${minuteAngle}deg)` }}
            />
            <span className="clock-center" />
          </div>
        </div>
        <div className="day-time-controls" aria-label="School day stages">
          {dayStages.map((s, i) => (
            <button
              key={s.time}
              onClick={() => {
                if (root.current && innerWidth >= 1000 && !disabled) {
                  window.scrollTo({
                    top:
                      root.current.getBoundingClientRect().top +
                      window.scrollY +
                      (root.current.offsetHeight - innerHeight) *
                        (i / 4 + 0.02),
                    behavior: "smooth",
                  });
                } else {
                  setActive(i);
                }
              }}
              aria-pressed={active === i}
            >
              <span>{s.time}</span>
              <small>{s.label}</small>
              <i />
            </button>
          ))}
        </div>
        <div className="desktop-day-scene">{scene(active)}</div>
        <div className="mobile-day-scenes">
          {dayStages.map((_, i) => scene(i))}
        </div>
      </div>
    </section>
  );
}

export function StakeholderExperience() {
  const [role, setRole] = useState("0");
  return (
    <section className="role-experience section wrap" id="people">
      <div className="section-heading">
        <div>
          <Eyebrow>Role-based access</Eyebrow>
          <h2>{homepage.sections[4].title}</h2>
        </div>
        <p>Choose a team to explore its workspace and day-to-day responsibilities.</p>
      </div>
      <Tabs value={role} onValueChange={setRole}>
        <TabsList className="role-tab-list" aria-label="School roles">
          {roles.map((r, i) => (
            <TabsTrigger key={r.id} value={String(i)}>
              {r.name}
              <ArrowUpRight size={16} />
            </TabsTrigger>
          ))}
        </TabsList>
        {roles.map((r, i) => (
          <TabsContent key={r.id} value={String(i)}>
            <div className={`role-perspective role-perspective-${i}`}>
              <div className="role-photo">
                <img
                  src={
                    i === 5
                      ? "/indian-parent.webp"
                      : i === 0 || i === 1
                        ? "/indian-leader.webp"
                        : "/indian-classroom.webp"
                  }
                  srcSet={
                    i === 5
                      ? "/indian-parent-800.webp 800w, /indian-parent.webp 1536w"
                      : i === 0 || i === 1
                        ? "/indian-leader-800.webp 800w, /indian-leader.webp 1536w"
                        : "/indian-classroom-800.webp 800w, /indian-classroom.webp 1536w"
                  }
                  sizes="(max-width:600px) 100vw, 42vw"
                  alt={
                    i === 5
                      ? "Parent and child sharing a school moment"
                      : i === 0 || i === 1
                        ? "Indian school staff in a school environment"
                        : "Teacher and students in an Indian classroom"
                  }
                  loading="lazy"
                  width="800"
                  height="1000"
                />
                <div>
                  <span>THE {r.name.toUpperCase()} VIEW</span>
                  <strong>{r.value}</strong>
                </div>
              </div>
              <div className="role-information">
                <span className="role-kicker">
                  0{i + 1} / ONE CONNECTED PLATFORM
                </span>
                <h3>{r.title}</h3>
                <p>{r.body}</p>
                <div className="role-product">
                  <ProductCanvas homepage mode={r.mode} compact />
                </div>
                <TextLink href="/book-demo">Request a Demo</TextLink>
              </div>
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </section>
  );
}

export function HumanMoment() {
  return (
    <section className="human-moment">
      <img
        src="/indian-classroom.webp"
        srcSet="/indian-classroom-800.webp 800w, /indian-classroom.webp 1536w"
        sizes="100vw"
        alt="Indian students and a teacher sharing a learning moment in a classroom"
        width="1600"
        height="1067"
        loading="lazy"
      />
      <div className="human-overlay" />
      <div className="wrap human-copy">
        <Eyebrow>Private K–12 schools and academies</Eyebrow>
        <h2>One connected system.<br/><em>Across your school group.</em></h2>
        <p>{homepage.sections[3].cards[1].paragraphs[0]}</p>
        <TextLink href="/book-demo">Request a Demo</TextLink>
      </div>
      <div className="human-note">
        <CheckCheck size={20} />
        <span>
          School groups and trusts.
          <br />
          <strong>Multi-branch centralisation.</strong>
        </span>
      </div>
    </section>
  );
}

export function ModuleEcosystem() {
  const [active, setActive] = useState(0);
  return (
    <section className="module-ecosystem section" id="modules">
      <div className="wrap">
        <div className="section-heading">
          <div>
            <Eyebrow>The connected platform</Eyebrow>
            <h2>{homepage.sections[1].title}</h2>
          </div>
          <TextLink href="/book-demo">Request a Demo</TextLink>
        </div>
        <div className="ecosystem-layout">
          <div className="ecosystem-grid" aria-label="Explore modules">
            {homeModules.map((m, i) => {
              const Icon = icons[i];
              return (
                <button
                  key={m.title}
                  className={`ecosystem-module ${active === i ? "module-active" : ""}`}
                  onClick={() => setActive(i)}
                  onMouseEnter={() => setActive(i)}
                  onFocus={() => setActive(i)}
                  aria-pressed={active === i}
                >
                  <span className="ecosystem-icon">
                    <Icon size={28} />
                  </span>
                  <span className="module-order">0{i + 1}</span>
                  <strong>{m.title}</strong>
                  <ArrowUpRight size={17} />
                </button>
              );
            })}
          </div>
          <div className="ecosystem-details">
          {homeModules.map((m, i) => (
          <div className={`ecosystem-focus ${active === i ? "focus-active" : ""}`} key={m.title} aria-hidden={active !== i} inert={active !== i}>
            <div className="ecosystem-platform">
              <img
                src="/cleezo-logo.png"
                width="48"
                height="50"
                alt="Cleezo Class"
              />
              <span>ONE CONNECTED PLATFORM</span>
            </div>
            <span className="focus-module-label">
              0{i + 1} / {m.label}
            </span>
            <h3>{m.heading}</h3>
            {m.paragraphs.map(text => <p key={text}>{text}</p>)}
            <div className="module-feature-list">
              {m.features.map((label) => (
                <span key={label}>
                  <Check size={16} />
                  {label}
                </span>
              ))}
            </div>
            <TextLink href="/book-demo">Request a Demo</TextLink>
          </div>
          ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export function AttendanceWalkthrough() {
  const [step, setStep] = useState("0");
  const [absent, setAbsent] = useState(true);
  const root = useRef<HTMLElement>(null);
  const disabled = useMotionDisabled();
  useEffect(() => {
    if (disabled) return;
    gsap.registerPlugin(ScrollTrigger);
    const mm = gsap.matchMedia();
    mm.add("(min-width:1000px)", () => {
      const trigger = ScrollTrigger.create({
        trigger: root.current,
        start: "top 55%",
        end: "bottom 85%",
        onUpdate: (s) => {
          if (!root.current?.contains(document.activeElement))
            setStep(String(Math.min(2, Math.floor(s.progress * 3))));
        },
      });
      return () => trigger.kill();
    });
    return () => mm.revert();
  }, [disabled]);
  return (
    <section ref={root} className="attendance-walkthrough section wrap">
      <div className="section-heading">
        <div>
          <Eyebrow>A closer look at the workflow</Eyebrow>
          <h2>{homepage.sections[1].cards[3].title}</h2>
        </div>
        <p>{homepage.sections[1].cards[3].paragraphs[0]}</p>
      </div>
      <Tabs value={step} onValueChange={setStep} className="walkthrough-layout">
        <TabsList
          className="walkthrough-steps"
          aria-label="Attendance workflow"
        >
          {attendanceSteps.map((s, i) => (
            <TabsTrigger key={s.title} value={String(i)}>
              <span>0{i + 1}</span>
              <span>
                <strong>{s.title}</strong>
                <small>{s.body}</small>
              </span>
            </TabsTrigger>
          ))}
        </TabsList>
        {[0, 1, 2].map((i) => (
          <TabsContent value={String(i)} key={i} className="walkthrough-screen">
            <div className="walkthrough-toolbar">
              <span>
                <CalendarDays size={17} /> Biometric / RFID attendance
              </span>
              <span>Illustrative preview</span>
            </div>
            <div className="walkthrough-body">
              <span className="mono">CLASS 6A · MORNING SESSION</span>
              <h3>
                {
                  [
                    "Synchronise supported devices.",
                    "Review attendance exceptions.",
                    "Keep parents updated.",
                  ][i]
                }
              </h3>
              {i === 0 ? (
                <>
                  <div className="context-fields">
                    {[
                      ["Class", "6"],
                      ["Section", "A"],
                      ["Date", "21 September"],
                      ["Device", "Biometric / RFID"],
                    ].map(([label, value]) => (
                      <div key={label}>
                        <small>{label}</small>
                        <strong>{value}</strong>
                        <Check size={16} />
                      </div>
                    ))}
                  </div>
                  <div className="lesson-banner">
                    <Clock3 size={23} />
                    <span>
                      10:30 · Science<small>Our environment · Class 6A</small>
                    </span>
                  </div>
                  <button className="button" onClick={() => setStep("1")}>
                    Review synced attendance <ArrowRight size={17} />
                  </button>
                </>
              ) : i === 1 ? (
                <>
                  <p className="interaction-hint">
                    Try changing Kabir’s attendance status.
                  </p>
                  <div className="attendance-register">
                    {["Aarav S.", "Meera K.", "Riya P.", "Kabir A."].map(
                      (name, j) => (
                        <div key={name}>
                          <span className="student-initial">{name[0]}</span>
                          <strong>{name}</strong>
                          {j === 3 ? (
                            <button
                              className={`attendance-toggle ${absent ? "is-absent" : ""}`}
                              onClick={() => setAbsent(!absent)}
                              aria-label={`Kabir attendance: ${absent ? "Absent" : "Present"}. Click to change.`}
                            >
                              {absent ? "Absent" : "Present"}
                              <span />
                            </button>
                          ) : (
                            <span className="present-status">
                              <Check size={14} /> Present
                            </span>
                          )}
                        </div>
                      ),
                    )}
                  </div>
                  <button className="button" onClick={() => setStep("2")}>
                    Review follow-up <ArrowRight size={17} />
                  </button>
                </>
              ) : (
                <>
                  <div className="followup-card">
                    <span className="phone-header">
                      <MessageSquare size={20} /> WhatsApp attendance alert
                    </span>
                    <span className="mono">DRAFT · FOR REVIEW</span>
                    <h4>
                      {absent ? "Attendance follow-up" : "Attendance confirmed"}
                    </h4>
                    <p>
                      {absent
                        ? "Kabir is marked absent from the morning register. Please contact the class teacher if this needs correcting."
                        : "Kabir is marked present in the morning register. The class record is ready to review."}
                    </p>
                    <span className="review-recipient">
                      <ShieldCheck size={17} /> Check recipient and school
                      settings
                    </span>
                  </div>
                  <div className="message-route">
                    <span>Cleezo Class</span>
                    <i />
                    <Send size={20} />
                    <span>School WhatsApp number</span>
                  </div>
                  <p className="preview-caption">
                    Illustrative only. No message is sent.
                  </p>
                </>
              )}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </section>
  );
}

const assistance = ["Timetables", "Question papers", "Student photos", "Performance trends"];
export function HumanControlledAI() {
  const [step, setStep] = useState("0");
  return (
    <section className="human-ai section">
      <div className="wrap">
        <div className="section-heading">
          <div>
            <Eyebrow>AI & automation</Eyebrow>
            <h2>{homepage.sections[2].title}</h2>
          </div>
          <p>Explore timetable generation, curriculum-aware question papers, student photo preparation and performance trends.</p>
        </div>
        <Tabs value={step} onValueChange={setStep} className="ai-experience">
          <div className="ai-process">
            <span className="ai-caption">
              <Sparkles size={20} /> Automation for everyday school work
            </span>
            <TabsList
              aria-label="School automation capabilities"
              className="ai-process-list"
            >
              {assistance.map((label, i) => (
                <TabsTrigger key={label} value={String(i)}>
                  <span>0{i + 1}</span>
                  {label}
                  <ArrowRight size={18} />
                </TabsTrigger>
              ))}
            </TabsList>
            <TextLink href="/ai">Explore AI & Automation</TextLink>
          </div>
          <div className="automation-panels">
          {assistance.map((label, i) => (
            <TabsContent
              key={label}
              value={String(i)}
              className="ai-assistant-screen"
              forceMount
              aria-hidden={step !== String(i)}
              inert={step !== String(i)}
            >
              <div className="assistant-top">
                <span>
                  <Sparkles size={18} /> School automation
                </span>
                <span>Illustrative preview</span>
              </div>
              <div className="teacher-prompt">
                <span className="initial-badge">T</span>
                <p>{automationExamples[i].prompt}</p>
              </div>
              <div className="assistant-draft">
                <span className="draft-tag">ILLUSTRATIVE OUTPUT</span>
                <h3>{homepage.sections[2].cards[i].title}</h3>
                <p>{homepage.sections[2].cards[i].paragraphs[0]}</p><div className="automation-example"><strong>{automationExamples[i].output}</strong>{i === 0 ? <table className="automation-timetable"><caption className="sr-only">Illustrative weekly timetable for Class 6A</caption><thead><tr><th scope="col">Period</th><th scope="col">Subject</th><th scope="col">Teacher</th></tr></thead><tbody><tr><td>Mon 09:00</td><td>Mathematics</td><td>Ms Rao</td></tr><tr><td>Mon 10:00</td><td>Science</td><td>Mr Shah</td></tr><tr><td>Mon 11:30</td><td>English</td><td>Ms Sen</td></tr></tbody></table> : <p>{automationExamples[i].detail}</p>}</div>
                  <div className="ai-checks">
                    {automationExamples[i].checks.map(
                      (x) => (
                        <span key={x}>
                          <Check size={14} />
                          {x}
                        </span>
                      ),
                    )}
                  </div>
              </div>
              <div className="ai-human-decision">
                <ShieldCheck size={19} />
                <span>
                  {automationExamples[i].note}
                </span>
              </div>
                <button
                  className="ai-next"
                  onClick={() => setStep(String((i + 1) % assistance.length))}
                >
                  {assistance[(i + 1) % assistance.length]}
                  <ArrowRight size={16} />
                </button>
            </TabsContent>
          ))}
          </div>
        </Tabs>
      </div>
    </section>
  );
}

export function SchoolDemo() {
  return (
    <section className="school-demo section wrap">
      <div className="demo-devices" data-cursor="View">
        <div className="demo-tablet">
          <span>TEACHER EXPERIENCE</span>
          <div>
            <BookOpen size={22} />
            <h4>Academic records</h4>
            <p>Science · Class 6A</p>
            <div className="tablet-task">
              Digital report card<small>Marks and attendance in view</small>
            </div>
          </div>
        </div>
        <div className="demo-laptop">
          <ProductCanvas homepage mode={2} compact />
        </div>
        <div className="demo-phone">
          <span className="phone-island" />
          <div className="phone-brand">
            <img
              src="/cleezo-logo.png"
              width="26"
              height="28"
              alt="Cleezo Class"
            />
            <span>Parent view</span>
          </div>
          <h4>
            A little closer
            <br />
            to their day.
          </h4>
          <div className="phone-update">
            <Bell size={20} />
            <strong>Fee receipt</strong>
            <p>Your tuition fee receipt is available for review.</p>
            <span>Accounts · Today</span>
          </div>
          <div className="phone-task">
            <BookOpen size={18} />
            <span>
              Digital report card<small>Performance trends</small>
            </span>
          </div>
          <span className="phone-home" />
        </div>
        <p className="device-caption">Illustrative previews · sample data</p>
      </div>
      <div className="school-demo-copy">
        <Eyebrow>Built around your school</Eyebrow>
        <h2>{homepage.sections[3].cards[2].title}</h2><p>{homepage.sections[3].cards[2].paragraphs[0]}</p>
        <div className="demo-promises">
          {[
            "Private K–12 schools and academies",
            "School groups, trusts and multi-campus institutions",
            "CBSE, ICSE, SSC and State Board schools",
          ].map((x) => (
            <p key={x}>
              <Check size={19} />
              {x}
            </p>
          ))}
        </div>
        <Action>Request a Demo</Action>
        <p className="demo-small-note">
          Map the modules, roles and configuration to your school.
        </p>
      </div>
    </section>
  );
}

export function EditorialResources() {
  return (
    <section className="editorial-resources section">
      <div className="wrap">
        <div className="section-heading">
          <div>
            <Eyebrow>School operations and resources</Eyebrow>
            <h2>{homepage.sections[5].title}</h2>
          </div>
        </div>
        <p className="homepage-operations-intro">{homepage.sections[5].paragraphs[0]}</p>
        <ul className="homepage-operations-list">{homepage.sections[5].items.map(text => <li key={text}>{text}</li>)}</ul>
        <div className="editorial-carousel">
          {resources.map((r, i) => (
            <Link
              href={`/resources/${r.slug}`}
              className="editorial-card"
              key={r.slug}
              data-cursor="Explore"
            >
              <div className="editorial-image">
                <img
                  src={
                    [
                      "/indian-classroom.webp",
                      "/indian-leader.webp",
                      "/indian-parent.webp",
                    ][i % 3]
                  }
                  srcSet={
                    [
                      "/indian-classroom-800.webp 800w, /indian-classroom.webp 1536w",
                      "/indian-leader-800.webp 800w, /indian-leader.webp 1536w",
                      "/indian-parent-800.webp 800w, /indian-parent.webp 1536w",
                    ][i % 3]
                  }
                  sizes="(max-width:600px) 85vw, 33vw"
                  width="800"
                  height="600"
                  alt={
                    [
                      "A learning moment at an Indian school",
                      "Indian school staff at work",
                      "A family sharing a school moment",
                    ][i % 3]
                  }
                  loading="lazy"
                />
                <span>0{i + 1}</span>
              </div>
              <div className="editorial-card-copy">
                <span className="tiny-eyebrow">
                  {r.category} · {r.minutes}
                </span>
                <h3>{r.title}</h3>
                <p>{r.description}</p>
                <span className="editorial-link">
                  Read the guide
                  <ArrowUpRight size={21} />
                </span>
              </div>
            </Link>
          ))}
        </div>
        <div className="homepage-resources-action">
          <TextLink href="/resources">All resources</TextLink>
        </div>
      </div>
    </section>
  );
}

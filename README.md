# 🌿 AI Workplace Productivity Assistant

> An intelligent, human-centered workspace designed to automate repetitive business tasks, streamline asynchronous communication, and optimise personal workflow management through structured generative AI.

---

## 📌 Project Overview

In today's fast-paced digital workplace, professionals across industries lose hours each week to routine, repetitive tasks—such as drafting context-sensitive emails, parsing lengthy unstructured meeting notes into actionable items, and organising chaotic daily to-do lists. 

The **AI Workplace Productivity Assistant** addresses this challenge directly. Built with an earthy, modern SaaS aesthetic, the platform combines three core productivity engines into a cohesive workspace. Designed around human-in-the-loop validation, every AI-generated output is fully transparent, editable, and verified prior to external use.

---

## ✨ Features Implemented

The application delivers three core productivity modules alongside workspace-level intelligence:

### 1. Smart Email Generator
* **Audience Adaptation:** Tailors vocabulary, tone, and framing specifically for **Clients**, **Managers/Executives**, or **Internal Peers**.
* **Tone & Length Control:** Granular settings for Formal, Friendly, Persuasive, or Urgent messaging, with toggleable concise or detailed outputs.
* **Instant Draft Editing:** Outputs populate into an editable rich text area with one-click clipboard copying and draft regeneration.
* **Sample Data Loader:** Built-in sample email content (recipient role and key points) for instant testing and demonstration.

### 2. Meeting Notes Summarizer
* **Executive Summaries:** Distils dense discussions and transcripts into clear paragraphs.
* **Action Items & Accountability:** Automatically extracts deliverables, assigning owners and explicit checkboxes to track progress.
* **Decisions & Deadlines:** Highlights key organisational decisions and milestone dates in distinct badge views.
* **Sample Data Loader:** Built-in sample meeting transcripts for instant testing and demonstration.

### 3. AI Task Planner & Scheduler
* **Natural Language Brain Dump:** Converts unstructured task lists into prioritised, structured schedules.
* **Priority Classification:** Visual colour differentiation across High (rose/terracotta), Medium (warm amber), and Low (sage green) urgency levels.
* **Interactive Priority Overrides:** Direct dropdown toggles on badges allowing users to manually adjust priorities on the fly.
* **Time Optimisation Strategies:** Actionable tips suggesting time-blocking, task-batching, and chronotype-aligned deep-work sessions.
* **Sample Data Loader:** Built-in sample tasks for instant testing and demonstration.

### 4. Workspace & Responsible AI Experience
* **Permanent Disclaimers:** Visible headers reinforcing human-in-the-loop review.
* **Responsive Dashboard:** Sidebar navigation with quick-access metric tiles and collapsible mobile drawer support.
* **Calm Earth-Tone Palette:** Designed in light mode utilising sage greens (`#2D5A43`), warm creams (`#FBFBF9`), and slate accents for an accessible, stress-free user experience.

---

## 🧠 Prompt Engineering Strategy

Prompt engineering accounts for a significant portion of this project's architecture. Rather than relying on simple one-line requests, all tools utilise a structured system prompt framework incorporating **Role, Context, Task, and Constraints**:

### System Architecture Template
```text
[ROLE]: You are an elite Executive Productivity Assistant specialising in corporate communication and workflow efficiency.
[CONTEXT]: The user operates in a fast-paced professional environment requiring clear, actionable, and courteous outputs.
[TASK]: {Specific task: Draft email | Summarize transcript | Prioritize tasks}
[INPUT DATA]: {User raw text}
[PARAMETERS]: Audience: {Audience} | Tone: {Tone} | Constraints: {Time limits / formatting rules}
[OUTPUT FORMAT]: Structured JSON / Clean Markdown with explicit section headers.
[CONSTRAINTS]: Never fabricate dates or names; preserve user intent; keep tone respectful and professional.

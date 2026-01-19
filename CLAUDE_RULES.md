# Effective Use of LLM Agents for Coding

---

## The "Dumb Zone" Concept

As you fill the context window, model performance degrades. Around **40% utilization**, you start seeing diminishing returns (varies by task complexity).

**Implication:** If your context window is cluttered with MCP JSON, UUIDs, or unnecessary tool output, you're doing all your work in the "dumb zone" and won't get good results.

**Solution:** Stay in the "smart zone" through intentional compaction.

---

## Context Engineering Principles

### 1. Mask Rather Than Remove Tools

**Why:** Dynamically adding/removing tools breaks KV-cache.

**How:**
- Keep tool definitions stable
- Use masking to constrain available actions
- Prevents schema violations and hallucinated actions

### 2. Externalize Memory to File System

**Why:** Aggressive context compression loses information.

**How:**
- Treat file system as unlimited, persistent context
- Use indexing methodology
- Model learns to read files on demand
- Store references (URLs) instead of full content
- Enables restorable compression strategies - `/intentional_compaction`

### 3. Manipulate Attention Through Recitation

**Why:** "Lost-in-the-middle" problem—models lose track during long task sequences.

**How:**
- Create and update todo lists throughout execution
- This recites objectives into recent context
- Keeps global plan within model's attention span

### 4. Preserve Failure Traces

**Why:** Models learn from seeing their mistakes.

**How:**
- Keep failed actions and stack traces visible
- Model implicitly updates beliefs when seeing errors
- Reduces repeated mistakes
- Error recovery marks genuine agentic behavior

---

## Research-Plan-Implement (RPI) Methodology

A three-phase workflow that keeps context small through frequent intentional compaction. Each phase produces a compressed artifact that feeds the next phase.

**Goals:**
- Work well in brownfield codebases
- Solve complex problems
- No slop (high-quality output)
- Maintain mental alignment across team

### Phase 1: Research

**Purpose:** Understand how the system works.

**Activities:**
- Find the right files and understand code flow
- Stay objective—document what **is**, not what you want
- Use sub-agents to explore and return succinct summaries

**Output:** A research document with **exact files** and **line numbers** that matter to the problem being solved. **This is compressed truth**.

### Phase 2: Plan

**Purpose:** Outline exact implementation steps.

**Activities:**
- Include file names and line snippets
- Specify how to test after e**very change**
- Include actual code snippets of what will change or will be implemented

**Output:** A detailed plan that even a simple model could execute correctly.

**Sweet spot:** As plans get longer, reliability goes up but readability goes down. Find the right balance for your team and codebase.

### Phase 3: Implement

**Purpose:** Execute the plan with low context.

**Activities:**
- Follow the plan step by step
- Keep context window small
- Test after each change as specified

**Output:** Working code with minimal slop.

---

## Practical Techniques

### Intentional Compaction

**What:** Compress context into markdown files when switching tasks or going off-track.

**When to compact:**
- Before starting a new sub-task
- When the conversation goes off-track
- When you see the agent apologizing repeatedly

**Contents:**
- Exact files and line numbers relevant to the problem
- Current understanding of the system
- What has been tried and what worked/failed

**Benefit:** New context starts fresh with compressed knowledge.

### Sub-Agents

**Core purpose:** Controlling context through isolated execution, NOT anthropomorphizing roles.

**Example:** "Go find how authentication works" → returns "the file you want is src/auth.py:45"

The sub-agent does all the reading and searching, then returns a succinct summary to the parent agent.

#### Why Use Sub-Agents

- **Preserve context**: Keep exploration separate from main conversation
- **Parallel execution**: Run multiple independent investigations simultaneously

#### When to Use Sub-Agents vs Direct Work

**Use sub-agents when:**
- Task produces verbose output you don't need (tests, logs, docs)
- Work is self-contained and can return a summary
- You need parallel research on independent questions
- You want to isolate high-volume file operations

#### Sub-Agents vs Skills

| Aspect | Sub-Agents | Skills |
|--------|-----------|--------|
| **Context** | Isolated, separate window | Main conversation |
| **Output** | Summarized result returned | Full output in context |
| **Purpose** | Delegate self-contained tasks | Add specialized knowledge/guidance |
| **Best for** | Exploration, parallel work | Teaching Claude how to approach tasks |

#### Best Practices

1. **Design focused agents**: Each should excel at one specific task
2. **Write detailed descriptions**: Claude uses this to decide when to delegate
3. **Limit tool access**: Only grant necessary permissions
4. **Foreground vs Background**: Use background for non-blocking work; foreground for tasks needing permission prompts

### Progressive Disclosure

**Concept:** Layer context based on where you're working.

**Implementation:**
- Put a CLAUDE.md/context file in repo root with high-level info
- Add sub-context files in subdirectories with specific details
- Agent pulls in only what's needed for current task

**Benefit:** Stay in smart zone by loading only relevant context.

### On-Demand Context

**Why better than static docs:** Static documentation gets out of date. Code > comments > documentation in terms of truth. Generate context dynamically from actual code.

**Approach:**
- Give steering about which part of codebase to explore
- Launch sub-agents to take vertical slices through codebase
- Build research document that's a snapshot of actual truth

---

## Trajectory and Conversation Management

### Core Insight

The conversation trajectory influences the model's next action. A history of mistakes followed by corrections trains the model to expect more mistakes.

### Anti-Pattern

```
You: Do X
Agent: [fails]
You: That's wrong! Do X correctly!
Agent: [fails again]
You: No! Like this!
```

**Result:** Model learns "I do wrong thing, human yells" and continues the pattern.

### Better Approach

- If going off track, start a fresh context with lessons learned
- Compact the good parts and restart
- Avoid accumulating negative trajectory

### When to Restart

- Agent keeps apologizing ("I apologize for the confusion...")
- Same mistake repeating despite corrections
- Context feels cluttered or confused
- You've been steering for too long without progress

---

## Mental Alignment (Team Collaboration)

**Definition:** Keeping everyone on the team aligned about how the codebase is changing and why. Code review's most important function.

**Challenge:** With 2-3x more code being shipped, you can't read it all. But you can read the plans.

**Practices:**
- Review research and plans, not just code
- Include AI conversation threads in PRs
- Show the steps taken and how things were tested
- Catch problems early at the plan level

### Leverage Principle

> A bad line of code is one bad line. A bad line in a plan could be 100 bad lines of code. A bad line in research sends everything in the wrong direction. Focus human effort on highest-leverage parts of the pipeline.

---

## Critical Warnings

### Don't Outsource the Thinking

AI cannot replace thinking. It can only amplify the thinking you have done—or the lack of thinking you have done.

**Implication:** You MUST read and validate the plans. Tools that spew markdown just to make you feel good are not helping.


### Scale Your Approach

| Task Complexity | Approach |
|-----------------|----------|
| Simple | Just talk to the agent (changing button color) |
| Medium | Light research, then implement |
| Complex | Full research → plan → implement cycle |
| Very Complex | Multiple research rounds, may need to whiteboard manually |


## Quick Reference

### During Work

- [ ] Keep context window lean
- [ ] Use sub-agents for exploration
- [ ] Compact frequently
- [ ] Monitor for trajectory problems
- [ ] Restart fresh if going off track

### Optimize For

1. **Correctness** (most important—wrong info is worst)
2. **Completeness** (missing info causes hallucination)
3. **Size** (smaller is better)
4. **Trajectory** (positive momentum)

---

## Projekt-spezifische Regeln (Fleeting Time)

### Code-Stil

| Bereich | Sprache |
|---------|---------|
| Code (Variablen, Funktionen) | Englisch |
| Code-Kommentare | Englisch |
| UI-Texte | Wie im bestehenden Code |
| Commit-Messages | Englisch |
| Kommunikation mit User | Deutsch |

**Qualitaet:**
- TypeScript strict mode beachten
- Keine `any` Types wenn vermeidbar
- Bestehenden Code-Stil beibehalten
- Keine unnoetige Umformatierung

### Git & Commits

- Commits nur auf explizite Anfrage
- Aussagekraeftige Commit-Messages
- Kleine, atomare Commits bevorzugen

### Rote Linien (Was Claude NICHT tun soll)

- Keine grossen Refactorings ohne Absprache
- Keine neuen Dependencies ohne Rueckfrage
- Keine Aenderungen an der Projektstruktur ohne OK
- Nichts loeschen, was noch gebraucht werden koennte
- Keine nativen Module ohne Absprache (Expo-Kompatibilitaet!)

### Plattform-Anforderungen

- Aenderungen muessen auf **Android UND iOS** funktionieren
- Expo-kompatibel bleiben
- App muss mit `npm run dev:mobile` startbar bleiben
- Keine Breaking Changes an bestehenden Features

### Memory-Dateien

| Datei | Zweck | Wann aktualisieren |
|-------|-------|-------------------|
| `index.yaml` | Index aller Dateien, zuerst lesen | Bei neuen Dateien oder Struktur-Aenderungen |
| `CHECKPOINT.md` | Aktueller Stand fuer Restart | Nach jedem abgeschlossenen Task |
| `CLAUDE_MEMORY.md` | Projekt-Wissen, Session-Verlauf | Nach wichtigen Erkenntnissen |
| `TASKS.md` | Aktuelle Aufgaben | Tasks abhaken wenn erledigt |
| `CLAUDE_RULES.md` | Diese Regeln | Nur auf User-Anfrage |

---

## Context-Management & Checkpoints

### Verantwortlichkeiten

| Wer | Was |
|-----|-----|
| **Claude** | Schreibt Checkpoints nach jedem abgeschlossenen Task |
| **User** | Ueberwacht Context-Fuellstand und startet neuen Chat wenn noetig |

### Checkpoint schreiben - Wann?

- Nach jedem abgeschlossenen Task
- Vor groesseren Aenderungen (als Fallback)
- Wenn User darum bittet
- Bei Unsicherheit: Lieber einmal zu viel

### Checkpoint schreiben - Was?

```markdown
## Session-Status
- Phase (Research/Plan/Implement)
- Aktueller Task

## Was wurde gemacht
- Liste der abgeschlossenen Schritte

## Aktueller Stand des Codes
- Welche Dateien geaendert
- Was funktioniert, was nicht

## Naechster Schritt
- Was als naechstes ansteht

## Offene Fragen / Blocker
- Falls vorhanden
```

### Neuer Chat starten (User)

Wenn Context voll wird, startet User neuen Chat mit:

> "Lies index.yaml - dann mach weiter."

Die index.yaml enthaelt alle Verweise und Prioritaeten - Claude liest dann gezielt nur was noetig ist.

### Signale fuer Context-Probleme

Claude meldet sich wenn:
- Gleiche Fragen wiederholt gestellt werden
- Fruehere Entscheidungen vergessen werden
- Antworten merklich langsamer/schlechter werden

User entscheidet dann ob Restart noetig ist.
# DSA Debugging Lab (Phase 3, runnable build)

    npm install --legacy-peer-deps
    npm run dev          # http://localhost:5173
    npm test             # 58 tests (45 unit + 13 UI flow tests)
    npm run validate     # question-bank schema + line-number checks
    npm run run-bank     # compiles/runs buggy+correct code (needs python3, gcc, javac)

Add a problem: create src/data/problems/<topic>/pNNN.ts with defineProblem(...) and register it in src/data/problemRegistry.ts.

# Git Practical Usage – What I Actually Learned

This document explains how I practically used Git while building my Electron-based browser project **Studium**.  
It focuses on real problems, mistakes, and recovery instead of only commands.

---

## Why Git Was Important in My Project

During development, I frequently:
- Added new features
- Faced crashes and runtime errors
- Broke working code while experimenting

Git helped me save progress daily, experiment without fear, and restore a stable version when things went wrong.

---

## Daily Git Workflow

### Initialize Git (one time)
```bash
git init
Add files
bash
Copy code
git add .
Commit changes
bash
Copy code
git commit -m "Day 3: Tabs working"
I learned that meaningful commit messages help identify stable points later.

Ignoring Unnecessary Files
Large folders like node_modules should not be pushed to GitHub.

I used a .gitignore file:

gitignore
Copy code
node_modules/
This kept the repository clean and lightweight.

Pushing Code to GitHub
After committing locally, I pushed code regularly:

bash
Copy code
git push origin main
This acted as an online backup and version history.

Restoring a Stable Version (Most Important Lesson)
While adding a complex feature, my project became unstable and started crashing.
Instead of continuing to debug broken code, I decided to restore a previous stable version.

Finding a Stable Commit
bash
Copy code
git log --oneline
Example output:

arduino
Copy code
a3f9c12 Added brain feature
b7d2a88 Tabs and PDF stable
9c1e445 Initial browser setup
I selected the commit just before the unstable feature.

Restoring Using git reset --hard
bash
Copy code
git reset --hard b7d2a88
This command restored the project to a stable working state and removed broken changes locally.

Updating GitHub After Restore
Since GitHub had newer broken commits, I used:

bash
Copy code
git push origin main --force
This synchronized the remote repository with the stable local version.

Key Learnings
Git is a safety net, not just a backup tool

Breaking code is okay if commits exist

git reset --hard is powerful and useful

Stable code should be preserved before experimenting

Version control enables fearless learning

Conclusion
Using Git practically helped me recover from failures, learn faster, and work confidently.
This experience was more valuable than any theoretical explanation of Git.

If I can reset, I can experiment.

Copy code

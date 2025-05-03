@echo off
echo This script will fix the Git history to remove sensitive information.

echo Step 1: Creating a backup branch...
git branch backup-before-filter

echo Step 2: Setting up environment for BFG...
mkdir -p temp
cd temp

echo Step 3: Downloading BFG Repo-Cleaner...
curl -L -o bfg.jar https://repo1.maven.org/maven2/com/madgag/bfg/1.14.0/bfg-1.14.0.jar

echo Step 4: Creating a text file with tokens to remove...
echo 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 > tokens.txt

echo Step 5: Running BFG to remove tokens from Git history...
java -jar bfg.jar --replace-text tokens.txt ../.git

echo Step 6: Cleaning up the repository...
cd ..
git reflog expire --expire=now --all
git gc --prune=now --aggressive

echo Step 7: Force pushing the cleaned history...
git push --force

echo Step 8: Cleaning up temporary files...
rmdir /s /q temp

echo Done! The sensitive information has been removed from the Git history.
echo Your GitHub token is still available in your local .env file, which is now ignored by Git.

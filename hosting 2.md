# Legacy Windows Hosting Guide

This Windows-specific guide has been retired. Its repository, AWS access-key, SSH, and database-secret instructions no longer match the project and should not be used.

Use the current five-step guide in [hosting.md](hosting.md). It covers this repository's current frontend/backend layout and works from both Windows and macOS. The local terminal commands differ by operating system; AWS and GitHub setup are the same.

The previous copy included database credentials and a JWT secret. Rotate those values in MongoDB Atlas and replace the JWT secret. Removing this file does not erase older copies from Git history, so rotation is required even if the old values are no longer visible here.
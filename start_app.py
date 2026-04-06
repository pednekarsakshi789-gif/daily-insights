#!/usr/bin/env python3
"""
Daily Insights AI - One-Click Launcher
Starts both backend and frontend automatically
"""

import os
import sys
import subprocess
import time
import signal
import platform

class AppLauncher:
    def __init__(self):
        self.backend_process = None
        self.frontend_process = None
        self.venv_python = self._get_venv_python()
    
    def _get_venv_python(self):
        """Get the correct Python executable from venv"""
        if platform.system() == "Windows":
            return os.path.join("venv", "Scripts", "python.exe")
        else:
            return os.path.join("venv", "bin", "python")
    
    def check_requirements(self):
        """Verify we're in the right directory"""
        if not os.path.exists("Life-Summarizer-AI"):
            print("❌ ERROR: Please run this from the root 'dailyInsights' directory")
            sys.exit(1)
        
        if not os.path.exists(self.venv_python):
            print("❌ ERROR: Virtual environment not found")
            print("Please create it with: python -m venv venv")
            sys.exit(1)
        
        return True
    
    def run_setup(self):
        """Run backend setup verification"""
        print("\n[3] Verifying backend setup...")
        backend_path = os.path.join("Life-Summarizer-AI", "backend")
        
        result = subprocess.run(
            [self.venv_python, "setup.py"],
            cwd=backend_path,
            capture_output=True,
            text=True
        )
        
        print(result.stdout)
        if result.returncode != 0:
            print("❌ Setup failed!")
            print(result.stderr)
            sys.exit(1)
    
    def start_backend(self):
        """Start Flask backend"""
        print("\n[4] Starting Flask backend...")
        backend_path = os.path.join("Life-Summarizer-AI", "backend")
        
        print(f"   Running: {self.venv_python} app.py")
        print(f"   Location: {backend_path}")
        print("   Expected URL: http://localhost:5000")
        print()
        
        self.backend_process = subprocess.Popen(
            [self.venv_python, "app.py"],
            cwd=backend_path,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True
        )
    
    def start_frontend(self):
        """Start React frontend"""
        print("[5] Starting React frontend...")
        frontend_path = os.path.join("Life-Summarizer-AI", "frontend", "my-app")
        
        print(f"   Running: npm start")
        print(f"   Location: {frontend_path}")
        print("   Expected URL: http://localhost:3000")
        print()
        
        self.frontend_process = subprocess.Popen(
            ["npm", "start"],
            cwd=frontend_path,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True
        )
    
    def print_banner(self):
        """Print startup banner"""
        banner = """
╔════════════════════════════════════════════════════════════╗
║        🌟 DAILY INSIGHTS AI - QUICK START 🌟            ║
╚════════════════════════════════════════════════════════════╝
"""
        print(banner)
    
    def print_startup_info(self):
        """Print startup information"""
        info = """
╔════════════════════════════════════════════════════════════╗
║                    ✅ SETUP COMPLETE                      ║
╚════════════════════════════════════════════════════════════╝

📱 Frontend:  http://localhost:3000
🖥️  Backend:  http://localhost:5000

👤 Admin Account:
   Username: admin
   Password: admin123

🐛 Troubleshooting:
   - Check COMPREHENSIVE_TROUBLESHOOTING.md
   - Watch backend terminal for [DEBUG] messages
   - Check browser console (F12) for errors

⚠️  To stop the application:
   - Press Ctrl+C in each terminal
   - Or close both terminal windows

════════════════════════════════════════════════════════════
"""
        print(info)
    
    def run(self):
        """Run the full startup sequence"""
        self.print_banner()
        
        print("[1] Checking requirements...")
        self.check_requirements()
        print("    ✅ Directory structure verified")
        
        print("[2] Verifying Python environment...")
        print(f"    ✅ Using: {self.venv_python}")
        
        self.run_setup()
        
        self.start_backend()
        time.sleep(3)  # Give backend time to start
        
        self.start_frontend()
        time.sleep(2)
        
        self.print_startup_info()
        
        # Wait for processes
        try:
            while True:
                time.sleep(1)
        except KeyboardInterrupt:
            print("\n\nShutting down...")
            self.cleanup()
    
    def cleanup(self):
        """Clean up running processes"""
        if self.backend_process:
            try:
                self.backend_process.terminate()
            except:
                pass
        
        if self.frontend_process:
            try:
                self.frontend_process.terminate()
            except:
                pass

if __name__ == "__main__":
    launcher = AppLauncher()
    try:
        launcher.run()
    except Exception as e:
        print(f"\n❌ Error: {e}")
        sys.exit(1)

# check_structure.py
import os
from pathlib import Path

def check_project_structure():
    # Definiujemy oczekiwaną strukturę
    required_files = [
        "backend/requirements.txt",
        "backend/.env",
        "backend/app/__init__.py",
        "backend/app/main.py",
        "backend/app/config/__init__.py",
        "backend/app/config/settings.py",
        "backend/app/api/__init__.py",
        "backend/app/api/endpoints/__init__.py",
        "backend/app/api/endpoints/generation.py",
        "backend/app/core/models/__init__.py",
        "backend/app/core/models/property.py"
    ]

    print("Sprawdzanie struktury projektu...")
    print("-" * 50)

    all_files_exist = True
    for file_path in required_files:
        path = Path(file_path)
        exists = path.exists()
        status = "✅" if exists else "❌"
        print(f"{status} {file_path}")
        if not exists:
            all_files_exist = False

    print("-" * 50)
    if all_files_exist:
        print("Wszystkie wymagane pliki są na swoim miejscu!")
    else:
        print("Brakuje niektórych plików. Sprawdź oznaczenia ❌ powyżej.")

if __name__ == "__main__":
    check_project_structure()
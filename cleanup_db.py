from app import app, db, User

with app.app_context():
    users = User.query.all()
    for user in users:
        if user.username != user.username.strip():
            print(f"Fixing username: '{user.username}' -> '{user.username.strip()}'")
            user.username = user.username.strip()
    db.session.commit()
    print("Database cleanup complete.")

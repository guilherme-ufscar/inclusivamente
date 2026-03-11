async function test() {
    try {
        const res = await fetch("http://localhost:3000/api/activities/finish", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                "activity_id": "0.0.0.5",
                "student_id": "7b68ba65-1407-4baa-a7e7-f69f0fd0a136",
                "time_spent": 1200,
                "errors_count": 0,
                "correct_count": 5,
                "difficulty_perceived": "easy",
                "has_tutor": false
            })
        });
        const data = await res.json();
        console.log("Status:", res.status);
        console.log("Data:", data);
    } catch (e) { console.error("Error", e.message); }
}
test();

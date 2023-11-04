from fastapi import FastAPI

app = FastAPI()


@app.get("/board")
async def get_board():
    board_data = {
        "tasks": {
            "task-1": {"id": "task-1", "content": "This is task 1"},
            "task-2": {"id": "task-2", "content": "This is task 2"},
            "task-3": {"id": "task-3", "content": "This is task 3"},
        },
        "columns": {
            "column-1": {
                "id": "column-1",
                "title": "To do",
                "taskIds": ["task-2", "task-3"],
            },
            "column-2": {
                "id": "column-2",
                "title": "In progress",
                "taskIds": ["task-1"],
            },
        },
        "columnOrder": [
            "column-1",
            "column-2",
        ],
    }

    return {"board": board_data}

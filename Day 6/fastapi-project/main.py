from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field

app = FastAPI(
    title="Basic FastAPI API",
    description="A beginner-friendly API for managing items.",
    version="1.0.0",
)


class ItemCreate(BaseModel):
    name: str = Field(..., min_length=1, description="Name of the item")
    description: str = Field(default="", description="Optional item description")
    price: float = Field(..., gt=0, description="Price must be greater than zero")


class Item(ItemCreate):
    id: int


# In-memory storage for learning purposes.
# Data is reset whenever the application restarts.
items: dict[int, Item] = {}
next_item_id = 1


@app.get("/")
def home():
    return {"message": "Welcome to the Basic FastAPI API"}


@app.get("/health")
def health_check():
    return {"status": "ok"}


@app.get("/items", response_model=list[Item])
def get_items():
    return list(items.values())


@app.get("/items/{item_id}", response_model=Item)
def get_item(item_id: int):
    item = items.get(item_id)
    if item is None:
        raise HTTPException(status_code=404, detail="Item not found")
    return item


@app.post("/items", response_model=Item, status_code=201)
def create_item(item_data: ItemCreate):
    global next_item_id

    item = Item(id=next_item_id, **item_data.model_dump())
    items[next_item_id] = item
    next_item_id += 1
    return item


@app.put("/items/{item_id}", response_model=Item)
def replace_item(item_id: int, item_data: ItemCreate):
    if item_id not in items:
        raise HTTPException(status_code=404, detail="Item not found")

    item = Item(id=item_id, **item_data.model_dump())
    items[item_id] = item
    return item


@app.patch("/items/{item_id}", response_model=Item)
def update_item(item_id: int, item_data: dict):
    item = items.get(item_id)
    if item is None:
        raise HTTPException(status_code=404, detail="Item not found")

    allowed_fields = {"name", "description", "price"}
    unknown_fields = set(item_data) - allowed_fields
    if unknown_fields:
        raise HTTPException(
            status_code=422,
            detail=f"Unknown field(s): {', '.join(sorted(unknown_fields))}",
        )

    updated_data = item.model_dump()
    updated_data.update(item_data)

    try:
        updated_item = Item.model_validate(updated_data)
    except Exception as exc:
        raise HTTPException(status_code=422, detail="Invalid item data") from exc

    items[item_id] = updated_item
    return updated_item


@app.delete("/items/{item_id}", status_code=204)
def delete_item(item_id: int):
    if item_id not in items:
        raise HTTPException(status_code=404, detail="Item not found")

    del items[item_id]
    return None

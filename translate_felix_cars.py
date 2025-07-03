import json
from googletrans import Translator

translator = Translator()

def translate_text(text):
    if not text or not isinstance(text, str):
        return text
    try:
        return translator.translate(text, src='ko', dest='en').text
    except Exception:
        return text

def translate_car(car):
    fields_to_translate = [
        "manufacturer", "model", "className", "carName", "fuelType",
        "color", "description", "carDesc", "shopName","optionNames","description",
        "tbShopCityCodeName2", "tbDanjiInfoZipAddr", "tbShopAddr"
    ]
    for field in fields_to_translate:
        if field in car:
            car[field] = translate_text(car[field])
    # Translate optionNames array
    if "optionNames" in car and isinstance(car["optionNames"], list):
        car["optionNames"] = [translate_text(opt) for opt in car["optionNames"]]
    return car

with open('felixCars.json', encoding='utf-8') as f:
    cars = json.load(f)

translated_cars = [translate_car(car) for car in cars]

with open('felixCars_en.json', 'w', encoding='utf-8') as f:
    json.dump(translated_cars, f, ensure_ascii=False, indent=2)

print("Translation complete. Output: felixCars_en.json")
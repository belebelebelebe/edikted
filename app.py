from flask import Flask, render_template
import requests
from bs4 import BeautifulSoup as soup
import pandas as pd

app = Flask(__name__)

@app.route("/product/<string:category>")
def index(category):
    url = "https://edikted.com/collections/" + category
    html_content = soup(requests.get(url).content, "html")
    product_list = html_content.find_all("div", {"class": "product-card__title"})
    product_photo_list = html_content.find_all("a", {"class": "product-card__image"})
    title_list = []
    url_list = []
    photo_list = []
    for product in product_list:
        url_list.append("https://edikted.com" + product.find('a')['href'])
        title_list.append(product.text.replace("\n", "").strip())
    price_list = []
    productprice_list = html_content.find_all("span", {"class": "price-highlight"})
    for productprice in productprice_list:
        price_list.append(float(productprice.text.replace("\n", "").strip().replace("$", "")))
    for product_photo in product_photo_list:
        photo_list.append("https:" + product_photo.find('img')['src'])

    product_dict = {
        "title": title_list,
        "price": price_list,
        "url": url_list,
        "photo": photo_list
    }
    df = pd.DataFrame(product_dict)


    return render_template("product_detail.html",
    product_dict=product_dict, category=category)

if __name__ == "__main__":
    app.run(debug = True)

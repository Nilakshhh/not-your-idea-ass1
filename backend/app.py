from flask import Flask, jsonify
from flask_cors import CORS
from scrapper import WebScraper

app = Flask(__name__)
CORS(app)

data_config = [
    {
        "name": "Timing",
        "xpath": "//p//strong[contains(text(), 'Timing')] |  //p//b[contains(text(), 'Timing')]",
        "default": "Not Available"
    },
    {
        "name": "Page Heading",
        "xpath": "//h1[@class='elementor-heading-title elementor-size-default']",
        "default": "Not Available"
    },
    {
        "name": "Address",
        "xpath": "//p//strong[contains(text(), 'Address')] | //p//b[contains(text(), 'Address')] | //p[contains(text(),'Where:')]",
        "default": "Not Available"
    },
    {
        "name": "MustHave",
        "xpath": "//p//strong[contains(text(),'Must have') or contains(text(),'Must-have') or contains(text(),'Must-Have') or contains(text(),'Must Have')] | //p//b[contains(text(),'Must have') or contains(text(),'Must-have') or contains(text(),'Must-Have') or contains(text(),'Must Have')]",
        "default": "Not Available"
    },
    {
        "name": "Posting Date",
        "xpath": "//span[@class='elementor-icon-list-text elementor-post-info__item elementor-post-info__item--type-date']",
        "default": "Not Available"
    },
]

@app.route('/')
def home():
    scraper = WebScraper(data_config, "https://unsobered.com/category/in-your-city/")
    scraped_data = scraper.scrape()
    
    location=["gurugram", "mumbai", "delhi", "shillong", "kolkatta", "hyderabad", "pune", "chennai", "noida"]

    for data in scraped_data:
        address_list=data['Address']
        data['Address']='Other'.title()
        for address in address_list:
            for matches in location:
                if matches.lower() in address.lower():
                    print(f"{matches} here")
                    data['Address']=matches.title()
                    # break
    print(scraped_data)
        
    alcohol_type=["gin", "whiskey", "brandy", "vodka", "cocktail", "rum", "tequila", "mojito"]

    for data in scraped_data:
        address_list=data['MustHave']
        data['MustHave']='Other'.title()
        for address in address_list:
            for matches in alcohol_type:
                if matches.lower() in address.lower():
                    print(f"{matches} here")
                    data['MustHave']=matches.title()
                    # break
    print(scraped_data)
    for data in scraped_data:
        data['PostingDate'] = data['Posting Date']
        data['PageHeading'] = data['Page Heading']
        
    return jsonify(scraped_data)


if __name__ == '__main__':
    app.run(debug=True)

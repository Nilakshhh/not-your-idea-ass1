from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.options import Options
import os
import json

class WebScraper:
    def __init__(self, data_config, start_url):
        self.data_config = data_config
        self.start_url = start_url
        self.options = Options()
        # Uncomment the next line to run in headless mode
        # self.options.add_argument("--headless")
        self.driver = webdriver.Chrome(options=self.options)
        self.driver.maximize_window()
    
    def get_url(self, url):
        self.driver.get(url)

    def get_post_links(self):
        all_post_on_page_url = []
        all_post_on_page = self.driver.find_elements(By.XPATH, "//div[@class='elementor-widget-container']//article//a[@class='elementor-post__thumbnail__link']")
        for post in all_post_on_page:
            all_post_on_page_url.append(post.get_attribute("href"))
        return all_post_on_page_url

    def get_all_pages_url(self):
        all_pages_url = []
        all_pages = self.driver.find_elements(By.XPATH, "//a[@class='page-numbers']")
        for pages in all_pages:
            all_pages_url.append(pages.get_attribute("href"))
        return all_pages_url

    def get_data(self, field):
        all_data_list = []
        strong_list = self.driver.find_elements(By.XPATH, field["xpath"])

        if strong_list:
            for item in strong_list:
                parent = item.find_element(By.XPATH, "..")
                if field["name"] in ["Page Heading", "Posting Date"]:
                    text = item.text.strip()
                else:
                    text = parent.text.replace(item.text, '').strip()
                all_data_list.append(text.replace(": ", '').replace('\u202f', ''))
            return all_data_list
        else:
            return [field["default"]]

    def get_data_json(self):
        data = {"Link": self.driver.current_url}
        for field in self.data_config:
            data[field["name"]] = self.get_data(field)
        return data

    def scrape(self):
        self.get_url(self.start_url)
        all_post_url = self.get_post_links()
        all_pages_url = self.get_all_pages_url()
        all_post_url.extend(all_post_url)

        results = []
        for url in all_post_url[:50]:  # Limit to first x posts for demonstration
            self.get_url(url)
            data = self.get_data_json()
            results.append(data)  # Collect data for each post
        
        self.driver.quit()  # Close the browser after scraping
        return results

# Configuration for data extraction
data_config = [
    {
        "name": "Timing",
        "xpath": "//p//strong[contains(text(), 'Timing')] |  //p//b[contains(text(), 'Timing')]",
        "default": "Not Available"
    },
    {
        "name": "PageHeading",
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
        "name": "PostingDate",
        "xpath": "//span[@class='elementor-icon-list-text elementor-post-info__item elementor-post-info__item--type-date']",
        "default": "Not Available"
    },
]

# Example usage
if __name__ == '__main__':
    scraper = WebScraper(data_config, "https://unsobered.com/category/in-your-city/")
    scraped_data = scraper.scrape()
    print(scraped_data)

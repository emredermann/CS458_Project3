from time import sleep

from selenium import webdriver
from selenium.webdriver import ActionChains, Keys

chrome_options = webdriver.ChromeOptions()
driver = webdriver.Chrome(options=chrome_options)


def stringClean(string):
    return string.split(': ')[1]


# TEST EMPTY COORDINATES
def test_case_1():
    lat_locs = ['', '25', '']
    lng_locs = ['25', '', '']
    driver.get('http://localhost:3000/')
    action = ActionChains(driver)
    driver.find_element_by_id('input_choice_select').click()
    action.send_keys('Manual').key_down(Keys.ENTER).key_up(Keys.ENTER).perform()
    lat_ele = driver.find_element_by_id('latitude_input')
    lng_ele = driver.find_element_by_id('longitude_input')
    for i in range(3):
        lat_ele.send_keys(lat_locs[i])
        lng_ele.send_keys(lng_locs[i])
        driver.find_element_by_id('manual_submit').click()
        lat_ele.clear()
        lng_ele.clear()
        error = driver.find_element_by_id('error_msg').text
        assert error == 'Input can\'t be empty', 'Unexpected Process Results'


# TEST LONGITUDE RESTRICTIONS
def test_case_2_1():
    lat_loc = '0'
    lng_loc = '181'
    driver.get('http://localhost:3000/')
    action = ActionChains(driver)
    driver.find_element_by_id('input_choice_select').click()
    action.send_keys('Manual').key_down(Keys.ENTER).key_up(Keys.ENTER).perform()
    driver.find_element_by_id('latitude_input').send_keys(lat_loc)
    driver.find_element_by_id('longitude_input').send_keys(lng_loc)
    error = driver.find_element_by_id('error_msg').text
    assert error == 'Longitude must be between 180 and -180', 'Unexpected Process Results'


# TEST LATITUDE RESTRICTIONS
def test_case_2_2():
    lat_loc = '91'
    lng_loc = '0'
    driver.get('http://localhost:3000/')
    action = ActionChains(driver)
    driver.find_element_by_id('input_choice_select').click()
    action.send_keys('Manual').key_down(Keys.ENTER).key_up(Keys.ENTER).perform()
    driver.find_element_by_id('longitude_input').send_keys(lng_loc)
    driver.find_element_by_id('latitude_input').send_keys(lat_loc)
    error = driver.find_element_by_id('error_msg').text
    assert error == 'Latitude must be between 90 and -90', 'Unexpected Process Results'


# TEST EMPTY COUNTRY LOCATION
def test_case_3():
    # smack dab middle of Pacific Ocean
    lat_loc = 0
    lng_loc = -160
    driver.get('http://localhost:3000/')
    action = ActionChains(driver)
    driver.find_element_by_id('input_choice_select').click()
    action.send_keys('Manual').key_down(Keys.ENTER).key_up(Keys.ENTER).perform()
    driver.find_element_by_id('latitude_input').send_keys(lat_loc)
    driver.find_element_by_id('longitude_input').send_keys(lng_loc)
    driver.find_element_by_id('manual_submit').click()
    sleep(0.5)
    location = driver.find_element_by_id('loc_text').text
    location = stringClean(location)
    assert location == 'in the Sea probably.', 'Unexpected Process Results'


# TEST GPS LOCATION ON
def test_case_4():
    driver.execute_cdp_cmd("Emulation.setGeolocationOverride", {
        "latitude": 29.58,
        "longitude": 31.08,
        "accuracy": 100
    })
    driver.get('http://localhost:3000/')
    action = ActionChains(driver)
    driver.find_element_by_id('input_choice_select').click()
    action.send_keys('GPS').key_down(Keys.ENTER).key_up(Keys.ENTER).perform()
    driver.find_element_by_id('auto_submit').click()
    sleep(0.5)
    lat_text = driver.find_element_by_id('lat_text').text
    lng_text = driver.find_element_by_id('lng_text').text
    location = driver.find_element_by_id('loc_text').text

    lat_text = stringClean(lat_text)
    lng_text = stringClean(lng_text)
    location = stringClean(location)

    assert lat_text == '29.58', 'Unexpected Process Results'
    assert lng_text == '31.08', 'Unexpected Process Results'
    assert location == 'Egypt', 'Unexpected Process Results'


# TEST GPS LOCATION OFF
def test_case_5():
    prefs = {"profile.default_content_setting_values.geolocation": 2}
    chrome_options.add_experimental_option("prefs", prefs)
    driver = webdriver.Chrome(chrome_options=chrome_options)
    driver.get('http://localhost:3000/')
    action = ActionChains(driver)
    driver.find_element_by_id('input_choice_select').click()
    action.send_keys('GPS').key_down(Keys.ENTER).key_up(Keys.ENTER).perform()
    driver.find_element_by_id('auto_submit').click()
    error = driver.find_element_by_id('error_msg').text
    assert error == 'GPS is not active !!'


def run_test_cases():
    test_case_1()
    test_case_2_1()
    test_case_2_2()
    test_case_3()
    test_case_4()
    test_case_5()
    driver.close()


if __name__ == '__main__':
    run_test_cases()

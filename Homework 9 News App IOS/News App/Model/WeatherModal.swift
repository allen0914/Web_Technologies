//
//  WeatherModel.swift
//  News App
//
//  Created by Allen on 4/11/20.
//  Copyright © 2020 Allen. All rights reserved.
//

import Foundation
import SwiftyJSON

struct WeatherModal {
    let weatherJson: JSON
    let city: String
    let state: String
    
    var summary: String {
        return weatherJson["weather"][0]["main"].string!
    }
    
    var temperatureString: String {
        let temperature = weatherJson["main"]["temp"].double!
        let temperatureString: String = String(format:"%.2f", temperature)
        return "\(temperatureString)℃"
    }
    
    var summaryImageName: String {
        let summary = weatherJson["weather"][0]["main"].string!
        if summary == "Clouds" {return "cloudy_weather"}
        else if summary == "Clear" {return "clear_weather"}
        else if summary == "Snow" {return "snowy_weather"}
        else if summary == "Rain" {return "rainy_weather"}
        else if summary == "Thunderstorm" {return "thunder_weather"}
        else {return "sunny_weather"}
    }
}

//
//  WeatherManager.swift
//  News App
//
//  Created by Allen on 4/11/20.
//  Copyright © 2020 Allen. All rights reserved.
//

import Foundation
import SwiftyJSON
import Alamofire

struct WeatherManager {
    let weatherURL = "http://api.openweathermap.org/data/2.5/weather?appid=517da4aa58315ffffe604dbb18448664&units=metric"
    
    func fetchWeatherData(_ city: String, completion: @escaping(JSON) -> ()) {
        let city = city.replacingOccurrences(of: " ", with: "%20")
        let url = "\(weatherURL)&q=\(city)"
        
        AF.request(url).validate().responseJSON { response in
            switch response.result {
                
            case .success(let value):
                let weatherJsonObj = JSON(value)
                completion(weatherJsonObj)
                
            case .failure(let error):
                let errorJsonObj = JSON(error)
                completion(errorJsonObj)
            }
        }
    }
}

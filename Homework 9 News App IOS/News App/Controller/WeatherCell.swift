//
//  WeatherCell.swift
//  News App
//
//  Created by Allen on 4/14/20.
//  Copyright © 2020 Allen. All rights reserved.
//

import UIKit

class WeatherCell: UITableViewCell {
    
    @IBOutlet weak var weatherImageView: UIImageView!
    @IBOutlet weak var weatherrTempLabel: UILabel!
    @IBOutlet weak var weatherStateLabel: UILabel!
    @IBOutlet weak var weatherSummaryLabel: UILabel!
    @IBOutlet weak var weatherCityLabel: UILabel!
    
    
    func setWeather(weather: Weather) {
        weatherImageView.image = weather.image
        weatherrTempLabel.text = weather.temp
        weatherStateLabel.text = weather.state
        weatherSummaryLabel.text = weather.summary
        weatherCityLabel.text = weather.city
        weatherImageView.layer.cornerRadius = 10
        weatherImageView.clipsToBounds = true
    }
    
}

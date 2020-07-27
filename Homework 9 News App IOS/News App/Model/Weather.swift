//
//  Weather.swift
//  News App
//
//  Created by Allen on 4/14/20.
//  Copyright © 2020 Allen. All rights reserved.
//

import Foundation
import UIKit

class Weather{
    var image: UIImage
    var city: String
    var temp: String
    var state: String
    var summary: String
    
    init(image: UIImage, city: String, temp: String, state: String, summary: String) {
        self.image = image
        self.city = city
        self.temp = temp
        self.state = state
        self.summary = summary
    }
}

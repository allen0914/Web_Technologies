//
//  DetailArticle.swift
//  News App
//
//  Created by Allen on 4/15/20.
//  Copyright © 2020 Allen. All rights reserved.
//

import Foundation
import UIKit

class DetailArticle {
    var title: String
    var image: UIImage
    var date: String
    var description: String
    var section: String

    init(title: String, image: UIImage, date: String, description: String, section: String) {
        self.title = title
        self.image = image
        self.date = date
        self.description = description
        self.section = section
    }
    
}

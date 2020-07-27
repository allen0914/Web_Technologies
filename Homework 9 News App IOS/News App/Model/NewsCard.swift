//
//  NewsCard.swift
//  News App
//
//  Created by Allen on 4/14/20.
//  Copyright © 2020 Allen. All rights reserved.
//

import Foundation
import UIKit

class NewsCard {
    var image: UIImage
    var title: String
    var timeAndSection: String
    var articleID: String
    var imageURL: String
    var rawTimeAndSection: String
    
    init(image: UIImage, title: String, timeAndSection: String, articleID: String, imageURL: String, rawTimeAndSection: String) {
        self.image = image
        self.title = title
        self.timeAndSection = timeAndSection
        self.articleID = articleID
        self.imageURL = imageURL
        self.rawTimeAndSection = rawTimeAndSection
    }
    
}

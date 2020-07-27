//
//  Bookmark.swift
//  News App
//
//  Created by Allen on 4/16/20.
//  Copyright © 2020 Allen. All rights reserved.
//

import Foundation
import UIKit

class Bookmark {
    var title: String
    var image: UIImage
    var dateAndSection: String
    var articleID: String

    init(title: String, image: UIImage, dateAndSection: String, articleID: String) {
        self.title = title
        self.image = image
        self.dateAndSection = dateAndSection
        self.articleID = articleID
    }

}




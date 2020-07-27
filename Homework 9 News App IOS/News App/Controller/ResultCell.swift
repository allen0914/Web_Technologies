//
//  ResultCell.swift
//  News App
//
//  Created by Allen on 4/22/20.
//  Copyright © 2020 Allen. All rights reserved.
//

import UIKit

class ResultCell: UITableViewCell {
    
    @IBOutlet weak var resultLabel: UILabel!
    
    var searchResult: String = ""
    
    func setSearchResult(searchResult: String) {
        resultLabel.text = searchResult
    }
}

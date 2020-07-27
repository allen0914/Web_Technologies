//
//  DetailedArticleManager.swift
//  News App
//
//  Created by Allen on 4/15/20.
//  Copyright © 2020 Allen. All rights reserved.
//

import Foundation
import SwiftyJSON
import Alamofire

struct DetailedArticleManager {
    let detailArticleURL = "http://ec2-54-92-188-195.compute-1.amazonaws.com:4000/guardian/article"
    
    func fetchWeatherData(_ articleID: String, completion: @escaping(JSON) -> ()) {
        let url = "\(detailArticleURL)?id=\(articleID)"
        
        AF.request(url).validate().responseJSON { response in
            switch response.result {
                
            case .success(let value):
                let detailArticleJsonObj = JSON(value)
                completion(detailArticleJsonObj)
                
            case .failure(let error):
                let detailArticleJsonObj = JSON(error)
                completion(detailArticleJsonObj)
            }
        }
    }
}

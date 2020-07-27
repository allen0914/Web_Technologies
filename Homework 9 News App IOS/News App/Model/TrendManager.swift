//
//  TrendManager.swift
//  News App
//
//  Created by Allen on 4/12/20.
//  Copyright © 2020 Allen. All rights reserved.
//

import Foundation
import SwiftyJSON
import Alamofire

struct TrendManager {
    
    func fetchTrendData(_ item: String, completion: @escaping(JSON) -> ()) {
        let url = "http://ec2-54-92-188-195.compute-1.amazonaws.com:4000/trends/\(item)"
        
        AF.request(url).validate().responseJSON { response in
            switch response.result {
                
            case .success(let value):
                let trendJsonObj = JSON(value)
                completion(trendJsonObj)
                
            case .failure(let error):
                let trendJsonObj = JSON(error)
                completion(trendJsonObj)
            }
        }
    }
}

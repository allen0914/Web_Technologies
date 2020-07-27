//
//  HomeNewsCardManager.swift
//  News App
//
//  Created by Allen on 4/14/20.
//  Copyright © 2020 Allen. All rights reserved.
//


import Foundation
import SwiftyJSON
import Alamofire


struct NewsCardManager {
    
    func fetchHomeNewsCardData(completion: @escaping(JSON) -> ()) {
        
        AF.request("http://ec2-54-92-188-195.compute-1.amazonaws.com:4000/guardian/home").validate().responseJSON { response in
            switch response.result {
                
            case .success(let value):
                completion(JSON(value))
                
            case .failure(let error):
                completion(JSON(error))
            }
        }
    }
    
    func fetchSectionNewsCardData(_ section: String, completion: @escaping(JSON) -> ()) {
        AF.request("http://ec2-54-92-188-195.compute-1.amazonaws.com:4000/guardian/section/\(section)").validate().responseJSON { response in
            switch response.result {
                
            case .success(let value):
                completion(JSON(value))
                
            case .failure(let error):
                completion(JSON(error))
            }
        }
    }
    
    func fetchSearchNewsCardData(_ searchContent: String, completion: @escaping(JSON) -> ()) {
        let searchContent = searchContent.replacingOccurrences(of: " ", with: "%20")
        AF.request("http://ec2-54-92-188-195.compute-1.amazonaws.com:4000/guardian/search?q=/\(searchContent)").validate().responseJSON { response in
            switch response.result {
                
            case .success(let value):
                completion(JSON(value))
                
            case .failure(let error):
                completion(JSON(error))
            }
        }
    }
    
    
}

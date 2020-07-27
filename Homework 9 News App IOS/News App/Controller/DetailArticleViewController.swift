//
//  DetailArticleViewController.swift
//  News App
//
//  Created by Allen on 4/15/20.
//  Copyright © 2020 Allen. All rights reserved.
//

import UIKit
import SwiftSpinner
import SwiftyJSON
import Toast_Swift

class DetailArticleViewController: UIViewController {
    @IBOutlet weak var detailImage: UIImageView!
    @IBOutlet weak var detailTitle: UILabel!
    @IBOutlet weak var detailSection: UILabel!
    @IBOutlet weak var detailDate: UILabel!
    @IBOutlet weak var detailDescription: UILabel!
    @IBOutlet weak var bookmarkButton: UIBarButtonItem!
    @IBOutlet weak var twitterButton: UIBarButtonItem!
    
    
    
    var articleID: String = ""
    var titleName: String = ""
    var imageURL: String = ""
    var dateAndSection: String = ""
    
    let detailArticleManager = DetailedArticleManager()
    
    var bookmarkItem: [Bookmark] = []
    
    override func viewDidLoad() {
        SwiftSpinner.show("Loading Detailed article...")
        super.viewDidLoad()
        getDetailArticle()
        
    }
    
    override func viewWillAppear(_ animated: Bool) {
        let dict = UserDefaults.standard.dictionary(forKey: "bookmark")
        
        if(dict == nil) {
            bookmarkButton.image = UIImage(systemName: "bookmark")
        }
        else if(dict![articleID] == nil) {
            bookmarkButton.image = UIImage(systemName: "bookmark")
        }
        else {
            bookmarkButton.image = UIImage(systemName: "bookmark.fill")
        }
    }
    
    
    
    func getDetailArticle() {
        self.detailArticleManager.fetchWeatherData(articleID) { value in
            let image: UIImage
            if (value["image"].string == nil) {
                image = UIImage(named: "default-guardian")!
            }
            else {
                image = UIImage(data: try! Data(contentsOf: URL(string: value["image"].string!)!))!
            }
            
            
            self.titleName = value["title"].string!
            self.detailTitle.text = value["title"].string!
            
            if (value["image"].string == nil) {
                self.imageURL = "none"
            }
            else {
                self.imageURL = value["image"].string!
            }
            
            let dateString = value["date"].string!
            let indexStart = dateString.index(dateString.startIndex, offsetBy: 0)
            let indexEnd = dateString.index(dateString.endIndex, offsetBy: -6)
            let dateDisplay = dateString[indexStart...indexEnd]
            self.dateAndSection = "\(dateDisplay)   |\(value["section"].string!)"
            
            
            self.detailImage.image = image
            self.detailDescription.attributedText = value["description"].string!.htmlAttributed(size: 13)
            self.detailDate.text = value["date"].string!
            self.detailSection.text = value["section"].string!
            self.navigationItem.title = value["title"].string!
            
            SwiftSpinner.hide()
            
        }
    }
    
    
    
    
    
    @IBAction func viewFullArticleButtonPressed(_ sender: UIButton) {
        UIApplication.shared.open(URL(string: "https://www.theguardian.com/\(articleID)")!)
    }
    
    @IBAction func bookmarkButtonPressed(_ sender: Any) {
        var dict = UserDefaults.standard.dictionary(forKey: "bookmark")
        
        if(dict == nil) {
            UserDefaults.standard.set([articleID: [titleName, imageURL, dateAndSection]], forKey: "bookmark")
            bookmarkButton.image = UIImage(systemName: "bookmark.fill")
            self.view.makeToast("Article Bookmarked. Check out the bookmarks tab to view.", duration: 2.0, position: .bottom)
            
        }
        else if(dict![articleID] == nil) {
            dict?[articleID] = [titleName, imageURL, dateAndSection]
            UserDefaults.standard.set(dict, forKey: "bookmark")
            bookmarkButton.image = UIImage(systemName: "bookmark.fill")
            self.view.makeToast("Article Bookmarked. Check out the bookmarks tab to view.", duration: 2.0, position: .bottom)
            
        }
        else {
            dict?.removeValue(forKey: articleID)
            UserDefaults.standard.set(dict, forKey: "bookmark")
            bookmarkButton.image = UIImage(systemName: "bookmark")
            self.view.makeToast("Article Removed from Bookmarks.", duration: 2.0, position: .bottom)
            
        }
        
    }
    
    @IBAction func twitterButtonPressed(_ sender: Any) {
        let shareContent = "https://www.theguardian.com/\(articleID)"
        UIApplication.shared.open(URL(string: "https://twitter.com/intent/tweet?url=\(shareContent)&hashtags=CSCI_571_NewsApp")!)
    }
    
}


extension String {
    func htmlAttributed(size: CGFloat) -> NSAttributedString? {
        do {
            let htmlCSSString = "<style>" +
                "html *" +
                "{" +
                "font-size: \(size)pt !important;" +
            "}</style> \(self)"
            
            guard let data = htmlCSSString.data(using: String.Encoding.utf8) else {
                return nil
            }
            
            return try NSAttributedString(data: data,
                                          options: [.documentType: NSAttributedString.DocumentType.html,
                                                    .characterEncoding: String.Encoding.utf8.rawValue],
                                          documentAttributes: nil)
        } catch {
            print("error: ", error)
            return nil
        }
    }
}

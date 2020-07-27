//
//  NewsCardCell.swift
//  News App
//
//  Created by Allen on 4/14/20.
//  Copyright © 2020 Allen. All rights reserved.
//

import UIKit
import Toast_Swift

protocol ToastDelegate {
    func setAddToast()
    func setDeleteToast()
}

class NewsCardCell: UITableViewCell {


    @IBOutlet weak var newsCardImage: UIImageView!
    @IBOutlet weak var newsCardTitle: UILabel!
    @IBOutlet weak var newsCardTimeAndSection: UILabel!
    @IBOutlet weak var newsCardView: UIView!
    @IBOutlet weak var newCardButton: UIButton!
    
    var articleId: String = ""
    var bookmarkImage: String = ""
    var bookmarkTitle: String = ""
    var bookmarkTimeTimeAndSection: String = ""
    
    var delegate: ToastDelegate?
    
    func setBookmarkButton() {
        let dict = UserDefaults.standard.dictionary(forKey: "bookmark")
        if(dict == nil || dict![articleId] == nil) {
            newCardButton.setImage(UIImage(systemName: "bookmark"), for: .normal)
        }
        else {
            newCardButton.setImage(UIImage(systemName: "bookmark.fill"), for: .normal)
        }
    }
    
    
    func setHomeNewsCard(newsCard: NewsCard) {
        newsCardImage.image = newsCard.image
        bookmarkImage = newsCard.imageURL
        newsCardTitle.text = newsCard.title
        bookmarkTitle = newsCard.title
        newsCardTimeAndSection.text = newsCard.timeAndSection
        bookmarkTimeTimeAndSection = newsCard.rawTimeAndSection
        newsCardImage.layer.cornerRadius = 10
        newsCardImage.clipsToBounds = true
        newsCardView.layer.cornerRadius = 10
        
        newsCardView.layer.borderWidth = 0.5
        articleId = newsCard.articleID
    }
    
    
    @IBAction func bookmarkPressed(_ sender: UIButton) {
        var dict = UserDefaults.standard.dictionary(forKey: "bookmark")
        
        if(dict == nil) {
            UserDefaults.standard.set([articleId: [bookmarkTitle, bookmarkImage, bookmarkTimeTimeAndSection]], forKey: "bookmark")
            newCardButton.setImage(UIImage(systemName: "bookmark.fill"), for: .normal)
            delegate?.setAddToast()
        }
        else if(dict![articleId] == nil) {
            dict?[articleId] = [bookmarkTitle, bookmarkImage, bookmarkTimeTimeAndSection]
            UserDefaults.standard.set(dict, forKey: "bookmark")
            newCardButton.setImage(UIImage(systemName: "bookmark.fill"), for: .normal)
            delegate?.setAddToast()
        }
        else {
            dict?.removeValue(forKey: articleId)
            UserDefaults.standard.set(dict, forKey: "bookmark")
            newCardButton.setImage(UIImage(systemName: "bookmark"), for: .normal)
            delegate?.setDeleteToast()
        }
        
        
    }
    
}

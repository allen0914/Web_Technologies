//
//  BookmarkCollectionViewCell.swift
//  News App
//
//  Created by Allen on 4/16/20.
//  Copyright © 2020 Allen. All rights reserved.
//

import UIKit
import Toast_Swift


protocol CardDelegate {
    func setBookmarkData()
    func update()
    func setDeleteToast()

}


class BookmarkCollectionViewCell: UICollectionViewCell {

    

    @IBOutlet weak var bookmarkImage: UIImageView!
    @IBOutlet weak var bookmarkTitle: UILabel!
    @IBOutlet weak var bookmarkDateAndSection: UILabel!
    @IBOutlet weak var bookmarkView: UIView!
    
    var articleID: String = ""
    var delegate: CardDelegate?

    
    func setBookmarkCard(bookmark: Bookmark) {
        bookmarkImage.image = bookmark.image
        bookmarkTitle.text = bookmark.title
        bookmarkDateAndSection.text = bookmark.dateAndSection
//        bookmarkImage.layer.cornerRadius = 10
//        bookmarkImage.clipsToBounds = true
//        bookmarkView.layer.cornerRadius = 10
//        bookmarkView.clipsToBounds = true
        articleID = bookmark.articleID
    }
    
    

    @IBAction func bookmarkPressed(_ sender: UIButton) {
        print("allen1")
        var dict = UserDefaults.standard.dictionary(forKey: "bookmark")
        dict?.removeValue(forKey: articleID)
        UserDefaults.standard.set(dict, forKey: "bookmark")
//        NotificationCenter.default.post(name: NSNotification.Name(rawValue: "notificationName"), object: nil)
        delegate?.setBookmarkData()
        delegate?.update()
        delegate?.setDeleteToast()
        

    }
    

}




//
//  BookmarkViewController.swift
//  News App
//
//  Created by Allen on 4/16/20.
//  Copyright © 2020 Allen. All rights reserved.
//

import UIKit
import SwiftyJSON
import DGCollectionViewLeftAlignFlowLayout
import Toast_Swift

class BookmarkViewController: UIViewController, UICollectionViewDataSource, UICollectionViewDelegate, CardDelegate, UICollectionViewDelegateFlowLayout {
    func setDeleteToast() {
        self.view.makeToast("Article Removed from Bookmarks.", duration: 2.0, position: .bottom)
    }
    
    
    @IBOutlet weak var collectionView: UICollectionView!
    
    var collectionViewFlowLayOut: UICollectionViewFlowLayout!
    
    let cellIdentifier = "bookmarkViewCell"
    
    var bookmarkItem: [Bookmark] = []
    
    var myIndex = 0
    
    var indexPath : IndexPath = []
    
    
    override func viewDidLoad() {
        super.viewDidLoad()
        //        self.collectionView.collectionViewLayout = DGCollectionViewLeftAlignFlowLayout()
        
        
        collectionView.delegate = self
        collectionView.dataSource = self
        setBookmarkData()
        
        if (UserDefaults.standard.dictionary(forKey: "bookmark")?.count == 0) {
            collectionView.isHidden = true
        }
        else {
            collectionView.isHidden = false
        }
        
        
        
        //        func collectionView(_ collectionView: UICollectionView, layout collectionViewLayout: UICollectionViewLayout, sizeForItemAt indexPath: IndexPath) -> CGSize {
        //            return CGSize(width: 0, height: 0)
        //        }
        
        
        //        NotificationCenter.default.addObserver(self, selector: Selector(("setBookmarkData")), name: NSNotification.Name(rawValue: "notificationName"), object: nil)
        //        NotificationCenter.default.addObserver(self, selector: #selector(collectionView.reloadData), name: NSNotification.Name(rawValue: "UserlistUpdate"), object: nil)
        
        
    }
    
    override func viewWillAppear(_ animated: Bool) {
        setBookmarkData()
        self.collectionView.reloadData()
        if (UserDefaults.standard.dictionary(forKey: "bookmark")?.count == 0) {
            collectionView.isHidden = true
        }
        else {
            collectionView.isHidden = false
        }
        
    }
    
    
    
    func setBookmarkData() {
        let bookmarkDict = UserDefaults.standard.dictionary(forKey: "bookmark")
        var tempBookmarkItem: [Bookmark] = []
        
        for key in bookmarkDict!.keys {
            let bookmarkJsonData = JSON(bookmarkDict![key]!)
            
            let title = bookmarkJsonData[0].string!
            let dateAndSection = bookmarkJsonData[2].string!
            
            let image: UIImage
            if (bookmarkJsonData[1].string == nil || bookmarkJsonData[1].string == "none") {
                image = UIImage(named: "default-guardian")!
            }
            else {
                image = UIImage(data: try! Data(contentsOf: URL(string: bookmarkJsonData[1].string!)!))!
            }
            
            tempBookmarkItem.append(Bookmark(title: title, image: image, dateAndSection: dateAndSection, articleID: key))
            bookmarkItem = tempBookmarkItem
        }
    }
    
    func update() {
        //        print(self.bookmarkItem)
        
        self.collectionView.reloadData()
        
        if (UserDefaults.standard.dictionary(forKey: "bookmark")?.count == 0) {
            collectionView.isHidden = true
        }
        else {
            collectionView.isHidden = false
        }
    }
    
    
    
    
    
    
    func collectionView(_ collectionView: UICollectionView, numberOfItemsInSection section: Int) -> Int {
        if UserDefaults.standard.dictionary(forKey: "bookmark")!.count == 0 {
            return 0
        }
        else {
            return bookmarkItem.count
        }
        
    }
    
    func collectionView(_ collectionView: UICollectionView, cellForItemAt indexPath: IndexPath) -> UICollectionViewCell {
        let cell = collectionView.dequeueReusableCell(withReuseIdentifier: cellIdentifier, for: indexPath) as! BookmarkCollectionViewCell
        cell.setBookmarkCard(bookmark: bookmarkItem[indexPath.item])
        cell.layer.cornerRadius = 10
        cell.layer.borderWidth = 0.5
        cell.delegate = self
        return cell
    }
    
    func collectionView(_ collectionView: UICollectionView, didSelectItemAt indexPath: IndexPath) {
        myIndex = indexPath.row
        print(myIndex)
        performSegue(withIdentifier: "bookmarkShowDetail", sender: self)
    }
    
    override func prepare(for segue: UIStoryboardSegue, sender: Any?) {
        let detailArticleViewController = segue.destination as! DetailArticleViewController
        detailArticleViewController.articleID = self.bookmarkItem[myIndex].articleID
        //detailArticleViewController.articleID = self.newsCards[myIndex - 1].articleID
    }
    
    func collectionView(_ collectionView: UICollectionView, contextMenuConfigurationForItemAt indexPath: IndexPath, point: CGPoint) -> UIContextMenuConfiguration? {
        return UIContextMenuConfiguration(identifier: nil, previewProvider: nil, actionProvider: { suggestedActions in
            self.myIndex = indexPath.row
            self.indexPath = indexPath
            return self.makeContextMenu(bookmarkItem: self.bookmarkItem[indexPath.row], indexPath: indexPath)
        })
    }
    
    
    
    
    func contextMenuInteraction(_ interaction: UIContextMenuInteraction, configurationForMenuAtLocation location: CGPoint) -> UIContextMenuConfiguration? {
        
        return UIContextMenuConfiguration(identifier: nil, previewProvider: nil, actionProvider: { suggestedActions in
            
            return self.makeContextMenu(bookmarkItem: self.bookmarkItem[self.myIndex], indexPath: self.indexPath)
        })
    }
    
    func makeContextMenu(bookmarkItem: Bookmark, indexPath: IndexPath) -> UIMenu {
        var dict = UserDefaults.standard.dictionary(forKey: "bookmark")
        var bookmark: UIAction
        
        bookmark = UIAction(title: "Bookmark", image: UIImage(systemName: "bookmark.fill")) { action in
            dict?.removeValue(forKey: bookmarkItem.articleID)
            UserDefaults.standard.set(dict, forKey: "bookmark")
            
            self.view.makeToast("Article Removed from Bookmarks.", duration: 2.0, position: .bottom)
            
            self.setBookmarkData()
            self.collectionView.reloadData()
            if (UserDefaults.standard.dictionary(forKey: "bookmark")?.count == 0) {
                self.collectionView.isHidden = true
            }
            else {
                self.collectionView.isHidden = false
            }
        }
        
        
        
        
        let share = UIAction(title: "Share with Twitter", image: UIImage(named: "twitter")) { action in
            let shareContent = "https://www.theguardian.com/\(bookmarkItem.articleID)"
            UIApplication.shared.open(URL(string: "https://twitter.com/intent/tweet?url=\(shareContent)&hashtags=CSCI_571_NewsApp")!)
        }
        
        // Create and return a UIMenu with the share action
        return UIMenu(title: "Memu", children: [share, bookmark])
    }
    
    
    //    @IBAction func bookmarkButtonPressed(_ sender: UIButton) {
    //        print("allen2")
    //        self.setBookmarkData()
    //        print("allen3")
    //        self.collectionView.reloadData()
    //        //        NotificationCenter.default.post(name: NSNotification.Name(rawValue: "UserlistUpdate"), object: nil)
    //    }
    
}



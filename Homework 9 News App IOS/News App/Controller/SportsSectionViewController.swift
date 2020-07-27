//
//  SportsSectionViewController.swift
//  News App
//
//  Created by Allen on 4/18/20.
//  Copyright © 2020 Allen. All rights reserved.
//

import UIKit
import XLPagerTabStrip
import SwiftSpinner

class SportsSectionViewController: UIViewController, UITableViewDelegate, UITableViewDataSource, IndicatorInfoProvider, ToastDelegate {

    @IBOutlet weak var tableView: UITableView!
    
    let newsCardManager = NewsCardManager()
    var newsCards: [NewsCard] = []
    var myIndex = 0
        var indexPath : IndexPath = []
    
    private let refreshControl = UIRefreshControl()
    
    override func viewDidLoad() {
        super.viewDidLoad()
        SwiftSpinner.show("Loading SPORTS Headlines...")
        refreshControl.addTarget(self, action: #selector(refreshData(_:)), for: .valueChanged)
        
        tableView.delegate = self
        tableView.dataSource = self
        self.tableView.separatorStyle = UITableViewCell.SeparatorStyle.none
        setNewsCardArray()
    }
    
    @objc private func refreshData(_ sender: Any) {
        setNewsCardArray()
        self.refreshControl.endRefreshing()
    }
    
    override func viewWillAppear(_ animated: Bool) {
        setNewsCardArray()
        self.tableView.reloadData()
    }
    
    func setAddToast() {
        self.view.makeToast("Article Bookmarked. Check out the bookmarks tab to view.", duration: 2.0, position: .bottom)
    }
    
    func setDeleteToast() {
        self.view.makeToast("Article Removed from Bookmarks.", duration: 2.0, position: .bottom)
    }
    
    func setNewsCardArray() {
        var tempNewsCard: [NewsCard] = []
        
        self.newsCardManager.fetchSectionNewsCardData("sport") {value in
            
            for i in 0...(value.count - 1) {
                
                let image: UIImage
                if (value[i]["image"].string == nil) {
                    image = UIImage(named: "default-guardian")!
                }
                else {
                    image = UIImage(data: try! Data(contentsOf: URL(string: value[i]["image"].string!)!))!
                }
                
                let newsCard = NewsCard(
                    image: image,
                    title: value[i]["title"].string!,
                    timeAndSection:
                    "\(value[i]["time"].string!)     |\(value[i]["section"].string!)",
                    articleID: value[i]["id"].string!,
                    imageURL: value[i]["image"].string ?? "none",
                    rawTimeAndSection: "\(value[i]["rawTime"].string!)   |\(value[i]["section"].string!)"
                )
                tempNewsCard.append(newsCard)
            }
            self.newsCards = tempNewsCard
            self.tableView.reloadData()
            SwiftSpinner.hide()
        }
    }
    
    
    func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        return newsCards.count
    }
    
    
    func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        
        if #available(iOS 10.0, *) {
            tableView.refreshControl = refreshControl
        } else {
            tableView.addSubview(refreshControl)
        }
        
        let newsCard = newsCards[indexPath.row]
        let cell = tableView.dequeueReusableCell(withIdentifier: "SportsCardCell", for: indexPath) as! NewsCardCell
        cell.setHomeNewsCard(newsCard: newsCard)
        cell.setBookmarkButton()
        cell.delegate = self
        cell.selectionStyle = .none
        return cell
    }
    
    
    func tableView(_ tableView: UITableView, didSelectRowAt indexPath: IndexPath) {
        myIndex = indexPath.row
        if (indexPath.row >= 0) {
            performSegue(withIdentifier: "showDetailNewsCard", sender: self)
        }
    }
    
    
    override func prepare(for segue: UIStoryboardSegue, sender: Any?) {
        let detailArticleViewController = segue.destination as! DetailArticleViewController
        detailArticleViewController.articleID = self.newsCards[myIndex].articleID
    }
    

    func indicatorInfo(for pagerTabStripController: PagerTabStripViewController) -> IndicatorInfo {
        return IndicatorInfo(title: "SPORTS")
    }
    
    func tableView(_ tableView: UITableView, contextMenuConfigurationForRowAt indexPath: IndexPath, point: CGPoint) -> UIContextMenuConfiguration? {
        return UIContextMenuConfiguration(identifier: nil, previewProvider: nil, actionProvider: { suggestedActions in
            self.myIndex = indexPath.row
            self.indexPath = indexPath
            return self.makeContextMenu(newsCard: self.newsCards[indexPath.row], indexPath: indexPath)
        })
    }
    
    
    func contextMenuInteraction(_ interaction: UIContextMenuInteraction, configurationForMenuAtLocation location: CGPoint) -> UIContextMenuConfiguration? {
        
        return UIContextMenuConfiguration(identifier: nil, previewProvider: nil, actionProvider: { suggestedActions in
            
            return self.makeContextMenu(newsCard: self.newsCards[self.myIndex], indexPath: self.indexPath)
        })
    }
    

    func makeContextMenu(newsCard: NewsCard, indexPath: IndexPath) -> UIMenu {
        var dict = UserDefaults.standard.dictionary(forKey: "bookmark")
        var bookmark: UIAction
        if (dict?.count == 0 || dict![newsCard.articleID] == nil) {
            bookmark = UIAction(title: "Bookmark", image: UIImage(systemName: "bookmark")) { action in
                
                if(dict == nil) {
                    UserDefaults.standard.set([newsCard.articleID: [newsCard.title, newsCard.imageURL, newsCard.rawTimeAndSection]], forKey: "bookmark")
                    if let cell = self.tableView.cellForRow(at: indexPath) as? NewsCardCell {
                        cell.newCardButton.setImage(UIImage(systemName: "bookmark.fill"), for: .normal)
                    }
                    self.view.makeToast("Article Bookmarked. Check out the bookmarks tab to view.", duration: 2.0, position: .bottom)
                }
                    
                else if(dict![newsCard.articleID] == nil) {
                    dict?[newsCard.articleID] = [newsCard.title, newsCard.imageURL, newsCard.rawTimeAndSection]
                    UserDefaults.standard.set(dict, forKey: "bookmark")
                    
                    if let cell = self.tableView.cellForRow(at: indexPath) as? NewsCardCell {
                        cell.newCardButton.setImage(UIImage(systemName: "bookmark.fill"), for: .normal)
                    }
                    self.view.makeToast("Article Bookmarked. Check out the bookmarks tab to view.", duration: 2.0, position: .bottom)
                }
                    
                else {
                    dict?.removeValue(forKey: newsCard.articleID)
                    UserDefaults.standard.set(dict, forKey: "bookmark")
                    
                    if let cell = self.tableView.cellForRow(at: indexPath) as? NewsCardCell {
                        cell.newCardButton.setImage(UIImage(systemName: "bookmark"), for: .normal)
                    }
                    
                    self.view.makeToast("Article Removed from Bookmarks.", duration: 2.0, position: .bottom)
                }
            }
        }
            
        else {
            bookmark = UIAction(title: "Bookmark", image: UIImage(systemName: "bookmark.fill")) { action in
                
                if(dict == nil) {
                    UserDefaults.standard.set([newsCard.articleID: [newsCard.title, newsCard.imageURL, newsCard.rawTimeAndSection]], forKey: "bookmark")
                    if let cell = self.tableView.cellForRow(at: indexPath) as? NewsCardCell {
                        cell.newCardButton.setImage(UIImage(systemName: "bookmark.fill"), for: .normal)
                    }
                    self.view.makeToast("Article Bookmarked. Check out the bookmarks tab to view.", duration: 2.0, position: .bottom)

                }
                    
                else if(dict![newsCard.articleID] == nil) {
                    dict?[newsCard.articleID] = [newsCard.title, newsCard.imageURL, newsCard.rawTimeAndSection]
                    UserDefaults.standard.set(dict, forKey: "bookmark")
                    
                    if let cell = self.tableView.cellForRow(at: indexPath) as? NewsCardCell {
                        cell.newCardButton.setImage(UIImage(systemName: "bookmark.fill"), for: .normal)
                    }
                    self.view.makeToast("Article Bookmarked. Check out the bookmarks tab to view.", duration: 2.0, position: .bottom)
                }
                    
                else {
                    dict?.removeValue(forKey: newsCard.articleID)
                    UserDefaults.standard.set(dict, forKey: "bookmark")
                    
                    if let cell = self.tableView.cellForRow(at: indexPath) as? NewsCardCell {
                        cell.newCardButton.setImage(UIImage(systemName: "bookmark"), for: .normal)
                    }
                    
                    self.view.makeToast("Article Removed from Bookmarks.", duration: 2.0, position: .bottom)
                    
                }
            }
        }
        
        let share = UIAction(title: "Share with Twitter", image: UIImage(named: "twitter")) { action in
            let shareContent = "https://www.theguardian.com/\(newsCard.articleID)"
            UIApplication.shared.open(URL(string: "https://twitter.com/intent/tweet?url=\(shareContent)&hashtags=CSCI_571_NewsApp")!)
        }
        
        // Create and return a UIMenu with the share action
        return UIMenu(title: "Memu", children: [share, bookmark])
    }
}

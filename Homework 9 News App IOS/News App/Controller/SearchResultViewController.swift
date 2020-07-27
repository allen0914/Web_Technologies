//
//  SearchResultViewController.swift
//  News App
//
//  Created by Allen on 4/23/20.
//  Copyright © 2020 Allen. All rights reserved.
//

import UIKit
import SwiftSpinner

class SearchResultViewController: UIViewController, UITableViewDelegate, UITableViewDataSource, ToastDelegate {
    
    var searchContent: String = ""
    let newsCardManager = NewsCardManager()
    var newsCards: [NewsCard] = []
    private let refreshControl = UIRefreshControl()
    @IBOutlet weak var tableView: UITableView!
    var myIndex = 0
    //    var resultSearchController = UISearchController()
    var indexPath : IndexPath = []
    
    override func viewDidLoad() {
        SwiftSpinner.show("Loading Search Results...")
        super.viewDidLoad()
        tableView.delegate = self
        tableView.dataSource = self
        createNewsCardArray()
        refreshControl.addTarget(self, action: #selector(refreshData(_:)), for: .valueChanged)
        self.tableView.separatorStyle = UITableViewCell.SeparatorStyle.none
        
        // Do any additional setup after loading the view.
    }
    
    func setAddToast() {
        self.view.makeToast("Article Bookmarked. Check out the bookmarks tab to view.", duration: 2.0, position: .bottom)
    }
    
    func setDeleteToast() {
        self.view.makeToast("Article Removed from Bookmarks.", duration: 2.0, position: .bottom)
    }
    
    override func viewWillAppear(_ animated: Bool) {
        createNewsCardArray()
        self.tableView.reloadData()
    }
    
    
    @objc private func refreshData(_ sender: Any) {
        createNewsCardArray()
        self.refreshControl.endRefreshing()
    }
    
    func createNewsCardArray() {
        var tempNewsCard: [NewsCard] = []
        
        self.newsCardManager.fetchSearchNewsCardData(searchContent) {value in
            if (value.count > 0) {
                for i in 0...(value.count - 1) {
                    
                    let image: UIImage
                    if (value[i]["image"].string == nil) {
                        image = UIImage(named: "default-guardian")!
                    }
                    else {
                        image = UIImage(data: try! Data(contentsOf: URL(string: value[i]["image"].string!)!))!
                    }
                    
                    let homeNewsCard = NewsCard(
                        image: image,
                        title: value[i]["title"].string!,
                        timeAndSection:
                        "\(value[i]["time"].string!)     |\(value[i]["section"].string!)",
                        articleID: value[i]["id"].string!,
                        imageURL: value[i]["image"].string ?? "none",
                        rawTimeAndSection: "\(value[i]["rawTime"].string!)   |\(value[i]["section"].string!)"
                    )
                    
                    
                    tempNewsCard.append(homeNewsCard)
                }
                
                self.newsCards = tempNewsCard
                self.tableView.reloadData()
                SwiftSpinner.hide()
            }
            else {
                SwiftSpinner.hide()
            }
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
        
        
        let homeNewsCard = newsCards[indexPath.row]
        //let homeNewsCard = newsCards[indexPath.row - 1]
        let cell = tableView.dequeueReusableCell(withIdentifier: "NewsCardCell") as! NewsCardCell
        cell.setHomeNewsCard(newsCard: homeNewsCard)
        cell.setBookmarkButton()
        cell.delegate = self
        cell.selectionStyle = .none
        return cell
        //            }
        
        
    }
    
    func tableView(_ tableView: UITableView, didSelectRowAt indexPath: IndexPath) {
        
        
        myIndex = indexPath.row
        performSegue(withIdentifier: "showDetailNewsCard", sender: self)
    }
    
    
    
    override func prepare(for segue: UIStoryboardSegue, sender: Any?) {
        
        let detailArticleViewController = segue.destination as! DetailArticleViewController
        detailArticleViewController.articleID = self.newsCards[myIndex].articleID
        //detailArticleViewController.articleID = self.newsCards[myIndex - 1].articleID
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

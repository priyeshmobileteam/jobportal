package com.sarkariresult.clone.service;

import com.sarkariresult.clone.model.Category;
import com.sarkariresult.clone.model.Post;
import com.sarkariresult.clone.repository.PostRepository;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import java.io.IOException;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;

@Service
public class JobSyncScheduler {

    @Autowired
    private PostRepository postRepository;

    private static final String SARKARI_URL = "https://www.sarkariresult.com";
    private static final String USER_AGENT = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36";

    // Runs initially on startup after 10 seconds, then every 2 hours
    @Scheduled(initialDelay = 10000, fixedRateString = "7200000")
    public void syncSarkariResultData() {
        System.out.println("Starting automatic sync from sarkariresult.com at " + LocalDateTime.now());
        try {
            Document doc = Jsoup.connect(SARKARI_URL)
                    .userAgent(USER_AGENT)
                    .timeout(15000)
                    .get();

            // Under SarkariResult, main category tables are structured in columns
            // We can select elements containing links in the main tables
            // Typical structure: columns for Result, Admit Card, Latest Job
            // Let's look for tables with specific headers
            Elements quickLists = doc.select("ul.sarkari-quick-list");
            int count = 0;

            Elements allElements = doc.getAllElements();
            for (Element list : quickLists) {
                Category category = null;

                // Find list position in document order and search backward for the nearest header anchor
                int listIndex = allElements.indexOf(list);
                for (int i = listIndex - 1; i >= 0; i--) {
                    Element el = allElements.get(i);
                    if (el.tagName().equals("a")) {
                        String href = el.attr("abs:href").toLowerCase();
                        String text = el.text().trim().toLowerCase();

                        if (href.contains("/latestjob/") || href.contains("/outsourcing/") || text.contains("latest job") || text.contains("latestjob") || text.contains("outsourcing")) {
                            category = Category.JOB;
                            break;
                        } else if (href.contains("/admitcard/") || text.contains("admit card") || text.contains("admitcard")) {
                            category = Category.ADMIT_CARD;
                            break;
                        } else if (href.contains("/result/") || text.contains("result")) {
                            if (href.endsWith("/result/") || text.equals("result") || text.equals("results") || text.contains("परिणाम")) {
                                category = Category.RESULT;
                                break;
                            }
                        } else if (href.contains("/answerkey/") || text.contains("answer key") || text.contains("answerkey")) {
                            category = Category.ANSWER_KEY;
                            break;
                        } else if (href.contains("/syllabus/") || text.contains("syllabus")) {
                            category = Category.SYLLABUS;
                            break;
                        } else if (href.contains("/admission/") || href.contains("/certificate/") || href.contains("/important/") || text.contains("admission") || text.contains("certificate") || text.contains("important")) {
                            category = Category.ADMISSION;
                            break;
                        }
                    }
                }

                if (category == null) {
                    System.out.println("Warning: Could not determine category for list starting with: " + 
                        (list.select("li a").isEmpty() ? "empty" : list.select("li a").first().text()));
                    continue;
                }

                // Extract all active links inside this categorized list
                Elements items = list.select("li a");
                for (Element item : items) {
                    String href = item.attr("abs:href");
                    String text = item.text().trim();
                    if (text.isEmpty() || text.length() < 5) continue;

                    String cleanedTitle = cleanBranding(text);
                    if (!postRepository.existsByTitle(cleanedTitle)) {
                        boolean success = parseAndSaveDetailPage(href, cleanedTitle, category);
                        if (success) {
                            count++;
                            // Short delay between crawls to prevent rate-limiting
                            Thread.sleep(150);
                        }
                    }
                    
                    if (count >= 500) {
                        break;
                    }
                }
                
                if (count >= 500) {
                    break;
                }
            }
            System.out.println("Sync finished! Added " + count + " new posts.");

        } catch (Exception e) {
            System.err.println("Error syncing data from SarkariResult: " + e.getMessage());
        }
    }

    private boolean parseAndSaveDetailPage(String url, String title, Category category) {
        try {
            Document detailDoc = Jsoup.connect(url)
                    .userAgent(USER_AGENT)
                    .timeout(10000)
                    .get();

            Post post = new Post();
            post.setTitle(cleanBranding(title));
            post.setCategory(category);
            post.setPostDate(LocalDateTime.now());
            post.setLastUpdateDate(LocalDateTime.now());
            post.setOfficialWebsiteUrl(url);

            // Extract Short Info
            Element shortInfoEl = detailDoc.select("td:contains(Short Information)").first();
            if (shortInfoEl != null) {
                post.setShortInfo(cleanBranding(shortInfoEl.text().replace("Short Information :", "").trim()));
            } else {
                post.setShortInfo(cleanBranding("Details of vacancy notification for " + title + ". Please read details below."));
            }

            // Parse Dates, Fees, Age Limits, Vacancies, and Links
            // SarkariResult pages are heavily structured as tables
            Elements rows = detailDoc.select("tr");

            Map<String, String> fees = new LinkedHashMap<>();
            Map<String, String> age = new LinkedHashMap<>();
            Map<String, String> vacancies = new LinkedHashMap<>();

            for (Element row : rows) {
                String rowText = row.text().toLowerCase();

                // Parse Dates & Fees (often in adjacent columns)
                if (rowText.contains("important dates") || rowText.contains("application fee")) {
                    Elements cells = row.select("td");
                    for (Element cell : cells) {
                        String cellText = getElementTextWithNewlines(cell);
                        if (cellText.contains("Application Begin") || cellText.contains("Last Date")) {
                            // Try to parse dates or extract text
                            String[] lines = cellText.split("\n");
                            for (String line : lines) {
                                line = line.trim();
                                if (line.contains("Application Begin") && line.contains(":")) {
                                    String dateStr = line.split(":", 2)[1].trim();
                                    post.setApplicationStartDate(tryParseDate(dateStr));
                                }
                                if (line.contains("Last Date") && line.contains("Apply") && line.contains(":")) {
                                    String dateStr = line.split(":", 2)[1].trim();
                                    post.setApplicationEndDate(tryParseDate(dateStr));
                                }
                            }
                        }
                        if (cellText.contains("General") || cellText.contains("SC / ST") || cellText.contains("OBC")) {
                            String[] lines = cellText.split("\n");
                            for (String line : lines) {
                                line = line.trim();
                                if (line.contains(":")) {
                                    String[] parts = line.split(":", 2);
                                    if (parts[0].trim().length() > 0 && parts[1].trim().length() > 0) {
                                        fees.put(parts[0].trim(), parts[1].trim());
                                    }
                                }
                            }
                        }
                    }
                }

                // Age limits
                if (rowText.contains("age limit")) {
                    Elements cells = row.select("td");
                    for (Element cell : cells) {
                        String cellText = getElementTextWithNewlines(cell);
                        if (cellText.contains("Minimum") || cellText.contains("Maximum") || cellText.contains("Min") || cellText.contains("Max")) {
                            String[] lines = cellText.split("\n");
                            for (String line : lines) {
                                line = line.trim();
                                if (line.contains("Min") || line.contains("Max") || line.contains("Age") || line.contains("Minimum") || line.contains("Maximum")) {
                                    if (line.contains(":")) {
                                        String[] parts = line.split(":", 2);
                                        if (parts[0].trim().length() > 0 && parts[1].trim().length() > 0) {
                                            age.put(parts[0].trim(), parts[1].trim());
                                        }
                                    } else {
                                        if (line.length() > 3 && !line.toLowerCase().contains("age limit as on")) {
                                            age.put("Details", line.trim());
                                        }
                                    }
                                }
                            }
                        }
                    }
                }

                // Vacancy Details (Total Post)
                if (rowText.contains("total post") || rowText.contains("vacancy details")) {
                    Elements cells = row.select("td");
                    for (Element cell : cells) {
                        String textVal = cell.text();
                        if (textVal.toLowerCase().contains("total") && textVal.replaceAll("[^0-9]", "").length() > 0) {
                            try {
                                String cleanNum = textVal.replaceAll("[^0-9]", "");
                                post.setTotalPosts(Integer.parseInt(cleanNum));
                            } catch (Exception ignored) {}
                        }
                    }
                }
            }

            // Formulate fallback strings if map parsed is empty
            if (fees.isEmpty()) {
                fees.put("General / OBC / EWS", "Refer to Notification");
                fees.put("SC / ST / PH", "Refer to Notification");
            }
            if (age.isEmpty()) {
                age.put("Age Limit Details", "Read official notification details.");
            }

            // Extract table for vacancies
            Elements vacancyTables = detailDoc.select("table:contains(Post Name)");
            if (!vacancyTables.isEmpty()) {
                Element vacTable = vacancyTables.first().clone();
                Elements tableLinks = vacTable.select("a");
                for (Element tl : tableLinks) {
                    String href = tl.attr("href");
                    String text = tl.text().toLowerCase();
                    String lowerHref = href != null ? href.toLowerCase() : "";

                    // Redirect Telegram / WhatsApp links to user's channel
                    boolean isTg = text.contains("telegram") || lowerHref.contains("t.me") || lowerHref.contains("telegram");
                    boolean isWa = text.contains("whatsapp") || lowerHref.contains("whatsapp.com") || lowerHref.contains("chat.whatsapp.com");
                    boolean isGen = text.contains("join") || text.contains("channel");

                    if (isTg || isWa || isGen) {
                        String targetUrl = isTg ? "https://t.me/boost/nokriin" : "https://whatsapp.com/channel/0029Vb8NM1a5q08aX2ej0r04";
                        tl.attr("href", targetUrl);
                        tl.attr("target", "_blank");
                        tl.removeAttr("onclick");
                        continue;
                    }

                    if (href != null && (href.toLowerCase().contains("sarkariresult") || href.startsWith("/") || href.startsWith("."))) {
                        tl.attr("href", "#");
                        tl.attr("onclick", "event.preventDefault(); return false;");
                        tl.removeAttr("target");
                    }
                }
                post.setVacancyDetails(cleanBranding(vacTable.outerHtml()));
            } else {
                post.setVacancyDetails(cleanBranding("<p>Refer to official notification details for vacancy breakdown.</p>"));
            }

            // Serialize maps to custom JSON-like string format
            post.setFeeDetails(cleanBranding(serializeMap(fees)));
            post.setAgeLimits(cleanBranding(serializeMap(age)));

            // Extract Direct Links from the links table
            // Usually has "Apply Online", "Download Notification", "Official Website"
            Elements detailLinks = detailDoc.select("a");
            for (Element dl : detailLinks) {
                String linkHref = dl.attr("abs:href");
                String linkText = dl.text().toLowerCase();

                if (linkHref != null && (linkHref.toLowerCase().contains("sarkariresult") || linkHref.startsWith("/") || linkHref.startsWith("."))) {
                    continue;
                }

                if (linkText.contains("apply online") || linkText.contains("click here") && dl.parent().text().toLowerCase().contains("apply online")) {
                    post.setApplyOnlineUrl(linkHref);
                } else if (linkText.contains("download notification") || linkText.contains("click here") && dl.parent().text().toLowerCase().contains("notification")) {
                    post.setOfficialNotificationUrl(linkHref);
                } else if (linkText.contains("official website") || linkText.contains("click here") && dl.parent().text().toLowerCase().contains("website")) {
                    post.setOfficialWebsiteUrl(linkHref);
                }
            }

            // Fallback URLs if not found (avoid setting them to the scraped sarkari page URL)
            if (post.getApplyOnlineUrl() == null || post.getApplyOnlineUrl().toLowerCase().contains("sarkariresult")) {
                post.setApplyOnlineUrl("");
            }
            if (post.getOfficialNotificationUrl() == null || post.getOfficialNotificationUrl().toLowerCase().contains("sarkariresult")) {
                post.setOfficialNotificationUrl("");
            }
            if (post.getOfficialWebsiteUrl() == null || post.getOfficialWebsiteUrl().toLowerCase().contains("sarkariresult")) {
                post.setOfficialWebsiteUrl("https://www.google.com");
            }

            postRepository.save(post);
            System.out.println("Successfully synced: " + title + " (" + category + ")");
            return true;

        } catch (IOException e) {
            System.err.println("Error parsing detail page: " + url + " - " + e.getMessage());
        }
        return false;
    }

    private String getElementTextWithNewlines(Element element) {
        if (element == null) return "";
        StringBuilder sb = new StringBuilder();
        buildTextWithNewlines(element, sb);
        return sb.toString();
    }

    private void buildTextWithNewlines(org.jsoup.nodes.Node node, StringBuilder sb) {
        if (node instanceof org.jsoup.nodes.TextNode) {
            sb.append(((org.jsoup.nodes.TextNode) node).text());
        } else if (node instanceof Element) {
            Element el = (Element) node;
            String tagName = el.tagName().toLowerCase();
            boolean isBlock = tagName.equals("br") || tagName.equals("li") || tagName.equals("p") || tagName.equals("div") || tagName.equals("tr") || tagName.equals("td");
            
            if (isBlock && sb.length() > 0 && sb.charAt(sb.length() - 1) != '\n') {
                sb.append("\n");
            }
            
            for (org.jsoup.nodes.Node child : el.childNodes()) {
                buildTextWithNewlines(child, sb);
            }
            
            if (isBlock && sb.length() > 0 && sb.charAt(sb.length() - 1) != '\n') {
                sb.append("\n");
            }
        }
    }

    private LocalDate tryParseDate(String dateStr) {
        if (dateStr == null) return null;
        java.util.regex.Pattern pattern = java.util.regex.Pattern.compile("(\\d{2})[/-](\\d{2})[/-](\\d{4})");
        java.util.regex.Matcher matcher = pattern.matcher(dateStr);
        if (matcher.find()) {
            String cleanDate = matcher.group();
            try {
                if (cleanDate.contains("/")) {
                    return LocalDate.parse(cleanDate, DateTimeFormatter.ofPattern("dd/MM/yyyy"));
                } else if (cleanDate.contains("-")) {
                    return LocalDate.parse(cleanDate, DateTimeFormatter.ofPattern("dd-MM-yyyy"));
                }
            } catch (Exception ignored) {}
        }
        return null;
    }

    private String cleanBranding(String text) {
        if (text == null) return null;
        String cleaned = text.replaceAll("(?i)Sarkari\\s*Result®?\\s*(WWW\\.)?SARKARIRESULT\\.COM\\s*Since\\s*2012", "Nokri.online");
        cleaned = cleaned.replaceAll("(?i)Sarkari\\s*Result®?", "Nokri.online");
        cleaned = cleaned.replaceAll("(?i)sarkariresult\\.com", "nokri.online");
        cleaned = cleaned.replaceAll("(?i)sarkariresult", "nokri.online");
        cleaned = cleaned.replaceAll("(?i)Since\\s*2012", "");
        return cleaned;
    }

    private String serializeMap(Map<String, String> map) {
        StringBuilder sb = new StringBuilder("{");
        int index = 0;
        for (Map.Entry<String, String> entry : map.entrySet()) {
            sb.append("\"").append(entry.getKey().replace("\"", "\\\"")).append("\": \"")
              .append(entry.getValue().replace("\"", "\\\"")).append("\"");
            if (index < map.size() - 1) {
                sb.append(", ");
            }
            index++;
        }
        sb.append("}");
        return sb.toString();
    }
}

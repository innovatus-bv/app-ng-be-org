// @ts-check
const puppeteer = require("puppeteer");
const fs = require("fs").promises;

async function scrapeTalkData() {
  let browser;
  try {
    browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto("https://ng-be.org/conference-day");

    const talkLinks = await page.evaluate(() => {
      return Array.from(
        document.querySelectorAll(
          ".main-content .summary-thumbnail-outer-container a"
        )
        // @ts-expect-error
      ).map((a) => a.href);
    });

    const talksData = [];
    const speakerData = [];
    let speakerId = 0;

    for (const [index, talkLink] of talkLinks.entries()) {
      console.log(`Scraping data for ${talkLink} at index ${index}`);
      try {
        await page.goto(talkLink);
        const data = await page.evaluate(
          (index, talkLink, speakerId) => {
            let lastSpeakerId = speakerId;

            const titleElement = document.querySelector(
              ".eventitem-column-meta h1"
            );
            if (!titleElement) {
              throw new Error("Title element not found");
            }
            const title = titleElement.textContent?.trim() || "";
            const name = title.split(" - ")[0].trim();
            const descriptionElements = document.querySelectorAll(
              ".main-content .sqs-html-content > h2:first-child ~ p"
            );

            if (!descriptionElements) {
              throw new Error("Description element not found");
            }
            const description = Array.from(descriptionElements).map(
              (element) => element.textContent?.trim() || ""
            );

            const titleParts = title.split(" - ");
            if (titleParts.length < 2) {
              throw new Error("Invalid title format - missing speaker name");
            }
            const speakerName = titleParts[1].trim();

            const speakerNames =
              speakerName.split(" and ").length > 1
                ? speakerName.split(" and ")
                : [speakerName];

            const speakerDescriptionElements = document.querySelectorAll(
              `.main-content .sqs-block-html .sqs-html-content > p:first-child`
            );

            if (!speakerDescriptionElements) {
              throw new Error("Speaker description element not found");
            }

            const speakerDescriptions = Array.from(
              speakerDescriptionElements
            ).map((element) => element.textContent?.trim() || "");

            const speakerImgElements = Array.from(
              document.querySelectorAll(
                `.main-content .sqs-block-html + .sqs-block-image img`
              )
            );

            if (!speakerImgElements) {
              throw new Error("Speaker image element not found");
            }

            const speakerImgs = Array.from(speakerImgElements).map(
              (element) => element.dataset.src
            );

            const speakers = speakerNames.map((name, index) => ({
              id: lastSpeakerId++,
              name,
              description: speakerDescriptions[index],
              img: speakerImgs[index],
            }));

            const keyTakeawaysElements = document.querySelectorAll(
              ".main-content .sqs-html-content > h2:nth-of-type(2) + :where(ol, ul) > li"
            );

            if (!keyTakeawaysElements || keyTakeawaysElements.length === 0) {
              throw new Error("Key takeaways element not found");
            }

            const keyTakeaways = Array.from(keyTakeawaysElements).map(
              (li) => li.textContent?.trim() || ""
            );

            const timeStart = (
              document.querySelector(".event-time-12hr-start")?.textContent ||
              ""
            )
              .replace(" ", " ")
              .trim();
            const timeEnd = (
              document.querySelector(".event-time-12hr-end")?.textContent || ""
            )
              .replace(" ", " ")
              .trim();
            const tracks = [];

            const id = index;

            return {
              talk: {
                name,
                description,
                speakers: speakers.map((s) => ({
                  id: s.id,
                  name: s.name,
                  img: s.img,
                })),
                keyTakeaways,
                timeStart,
                timeEnd,
                tracks,
                id,
                extractedFrom: talkLink,
              },
              speakers,
              lastSpeakerId,
            };
          },
          index,
          talkLink,
          speakerId
        );

        talksData.push(data.talk);
        speakerData.push(...data.speakers);
        speakerId = data.lastSpeakerId;
      } catch (error) {
        console.error(`Error scraping data for ${talkLink}:`, error.message);
      }
    }

    return { talksData, speakerData };
  } catch (error) {
    console.error("Error during scraping process:", error.message);
    throw error; // Re-throw the error to be caught in the outer promise chain
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

scrapeTalkData()
  .then((data) => {
    return Promise.allSettled([
      fs.writeFile(
        "src/assets/data/talks.json",
        JSON.stringify(data.talksData, null, 2),
        "utf8"
      ),
      fs.writeFile(
        "src/assets/data/speakers.json",
        JSON.stringify(data.speakerData, null, 2),
        "utf8"
      ),
    ]);
  })
  .then((results) => {
    results.forEach((result, index) => {
      const fileName = index === 0 ? "talks.json" : "speakers.json";
      if (result.status === "fulfilled") {
        console.log(`Data successfully written to src/assets/data/${fileName}`);
      } else {
        console.error(
          `Error writing data to src/assets/data/${fileName}:`,
          result.reason.message
        );
      }
    });
  })
  .catch((error) => {
    console.error(
      "Unexpected error during file write operations:",
      error.message
    );
  });

# Tutorial

[English](../en/TUTORIAL.md) · [Türkçe](../tr/TUTORIAL.md) · [Deutsch](../de/TUTORIAL.md) · [Español](../es/TUTORIAL.md) · [繁體中文](../zh/TUTORIAL.md)

This walks you through the four things people actually use SteamEdge for. It assumes you
have already signed in - if not, start with the [Setup guide](./SETUP.md).

---

## 1. Farm your first cards

**Card Farming** tab.

1. Press **Refresh game list**. SteamEdge reads your Steam badge pages and lists every
   game that still has card drops left.
2. Pick a **farming mode** (explained below).
3. Press **Start**.

That is it. Leave the window open - or close it to the tray if you enabled that in
Settings. Cards appear in **Recent drops** as they land.

### Which mode should I use?

| Mode | What it does | Use it when |
|---|---|---|
| **Sequential** | One game at a time, in queue order. | You want predictable, simple behaviour. |
| **Most cards** | Games with the most remaining cards first. | You want the highest card count fastest. |
| **Fewest cards** | Games with the fewest remaining first. | You want to *finish* badges quickly. |
| **Priority** | Your manual order, set with the row arrows. | You care about specific games first. |
| **Fast** | See below. | You have games under 2 hours of playtime. |

### About Fast mode

Steam only drops cards for a game after its **total playtime passes 2 hours**. Fast mode
handles this in two stages:

1. **Warm-up.** Every selected game under 2 hours is opened *in parallel* and brought up
   to the threshold. Steam counts time for every game that is open at once, so a batch
   takes as long as its furthest-behind member, not the sum.
2. **Rotation.** Once past the threshold, all games stay open together and the highlighted
   game changes every 1.5-2 minutes (randomised, so it is not a fixed rhythm).

When you press Start in Fast mode, SteamEdge tells you how many games need warming up
first.

### Queue controls

Each row in the queue has small buttons:

- **↑ / ↓** move the game up or down (this switches the mode to Priority)
- **Top** sends it to the front
- **✕** removes it from the queue entirely

Your order and removals are remembered between sessions. How long they are kept is set in
Settings → General → Backup → *How long remembered data is kept*.

---

## 2. Boost playtime hours

**Hour Booster** tab.

1. Search your library on the left and click games to add them to the queue.
2. Set the **concurrent limit** (2 / 8 / 16 / 32 or custom).
3. Set the **boost duration**, or choose Unlimited.
4. Press **Start**.

Steam counts playtime for every game that is open at once, up to a known limit of 32.

### Hour sync

This is the feature people ask for most. Turn it on in Settings → Hour Booster →
**Sync playtimes**.

Say you have three games at 8, 11 and 101 hours and you want them all equal. SteamEdge
does it in stages:

1. The 8-hour game runs alone until it reaches 11 hours.
2. Both now run together until they reach 101 hours.
3. All three continue together from there.

Before it starts, you get a confirmation box listing every stage and the total time
required. That total can be days - read it before you agree.

Three targets are available:

- **Highest of the selected** - the most-played game in your queue sets the goal
- **Manually entered hours** - you type the target
- **Highest in the library** - the highest playtime across your entire Steam account

Games already past the target are left alone.

---

## 3. Manage achievements

**Achievements** tab.

1. Search for a game in the picker at the top. Only games that track achievements appear.
2. Wait for the list to load - SteamEdge reads the real unlock state over the protocol.
3. Click the checkbox on any achievement, or use **Unlock selected** / **Lock selected**.

The right-hand panel shows the description, rarity, unlock date, and what percentage of
all players have it.

### Read this before bulk unlocking

- **Safe mode** (on by default) unlocks one at a time, with a randomised gap between each.
  Leave it on.
- The **unlock interval** defaults to 1 second. That is the fastest option. Unlocking
  hundreds of achievements in a couple of minutes is visible on your public profile and on
  sites that track achievement history.
- **Spread unlocks over time** widens the randomisation further, which looks more natural
  but takes much longer.
- Locking an achievement again is possible, but the original unlock date is gone forever.

Every unlock is written to a local log so you can see what you changed.

---

## 4. Sell items on the Market

**Inventory & Market** tab.

### Getting prices

When you open the tab, SteamEdge asks whether to fetch prices now. Steam rate-limits
market requests (roughly 20 per 30 seconds), so fetching a large inventory takes a while.

The faster path:

1. Answer **No, later**.
2. Set your filters - type, game, state, price range.
3. Press **Fetch prices** in the toolbar.

Only the items matching your current filter are fetched. The button locks and shows
progress until every request finishes, then unlocks. Change a filter and it becomes
available again for the new selection.

### Reading an item

Click any item. The right panel shows three separate boxes, and the difference matters:

| Box | What it means |
|---|---|
| **Current listings** | What sellers are *asking*. Not binding - anyone can list one item at $999,999. |
| **Sell instantly** | The highest standing buy order. This is what you get right now, today. |
| **Completed sales** | What the item actually sold for. **This is where the item's value comes from.** |

The value is the quantity-weighted median of completed sales, not an average. If 100
copies sold at $0.30 and one sold at $50, the average says $0.79 and the median says
$0.30. The median is right.

If there are no standing buy orders, the **Sell instantly** box does not go blank - it
falls back to the last completed sale and says so explicitly.

### Selling

All selling is done from the bottom bar, whether it is one item or fifty.

1. Tick the items you want to sell (or click a row and use the bottom bar directly).
2. Choose a pricing strategy:
   - **From average** - the completed-sales value. Earns most, sells slowest.
   - **Undercut** - one step below the cheapest listing. Sells fastest.
   - **Match lowest** - same price as the cheapest listing.
   - **Sell instantly** - to the highest buy order. Gone immediately.
   - **Custom** - type your own price.
3. Check the warning line. If any item is more than 25% above or below its real market
   value, SteamEdge says so before you commit.
4. Press **Sell**.

The bar shows both the **gross price** (what the buyer pays, the number you see on Steam)
and the **net price** (what reaches your wallet after Steam's ~13% cut).

> If your account has a mobile authenticator, Steam still asks you to approve each listing
> in the Steam app. SteamEdge does not auto-confirm on your behalf unless you imported a
> maFile.

---

## Useful habits

- **Check Overview first.** It shows what is running, how long the session has been going,
  and recent activity across all features.
- **Turn on Appear offline** (Settings → Privacy) if you do not want friends seeing you
  "playing" forty games.
- **Use Quiet hours** (Settings → Notifications) so the app does not ping you at 3 am.
- **Export your settings** occasionally (Settings → General → Backup). The export contains
  no login data, so it is safe to keep in cloud storage.

---

Next: [Instructions](./INSTRUCTIONS.md) - every setting explained.

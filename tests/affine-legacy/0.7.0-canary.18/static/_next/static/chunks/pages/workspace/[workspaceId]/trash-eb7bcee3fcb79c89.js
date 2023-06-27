(self.webpackChunk_N_E = self.webpackChunk_N_E || []).push([
  [8909],
  {
    81554: function (e, t, r) {
      (window.__NEXT_P = window.__NEXT_P || []).push([
        '/workspace/[workspaceId]/trash',
        function () {
          return r(8299);
        },
      ]);
    },
    97274: function (e, t, r) {
      'use strict';
      r.r(t),
        r.d(t, {
          BlockSuitePageList: function () {
            return D;
          },
        });
      var a = r(52903),
        i = r(37565),
        l = r(8183),
        n = r(96893),
        s = r(44502),
        o = r(72013),
        d = r(31921),
        c = r(91013);
      new WeakMap();
      let u = e => {
        let t = e.getBlockByFlavour('affine:paragraph'),
          r = t
            .slice(0, 10)
            .map(e => e.text.toString())
            .join('\n');
        return r.slice(0, 30);
      };
      var p = r(752),
        g = r(2784),
        k = r(74090),
        h = r(64813),
        f = r(53137);
      r(91108);
      var P = r(36054),
        v = r(5632),
        b = r(31747);
      let w = e => {
          let t = (0, v.useRouter)(),
            { openPage: a } = (0, b.$)(t),
            { createPage: i } = (0, P.S)(e),
            l = (0, p.Dv)(k.KA),
            n = (0, g.useCallback)(
              e => {
                var t;
                return (
                  (null === (t = l[e]) || void 0 === t ? void 0 : t.mode) ===
                  'edgeless'
                );
              },
              [l]
            ),
            s = (0, p.b9)(k.fZ),
            o = (0, g.useCallback)(() => {
              let t = i();
              return a(e.id, t.id);
            }, [e.id, i, a]),
            d = (0, g.useCallback)(() => {
              let t = i();
              return s(t.id, 'edgeless'), a(e.id, t.id);
            }, [e.id, i, a, s]),
            c = (0, g.useCallback)(async () => {
              let { showImportModal: t } = await r
                .e(280)
                .then(r.bind(r, 59799));
              t({ workspace: e });
            }, [e]);
          return {
            createPage: o,
            createEdgeless: d,
            importFile: c,
            isPreferredEdgeless: n,
          };
        },
        m = {
          all: e => !e.trash,
          public: e => !e.trash,
          trash: (e, t) => {
            let r = t.find(t => {
              var r;
              return null === (r = t.subpageIds) || void 0 === r
                ? void 0
                : r.includes(e.id);
            });
            return !(null == r ? void 0 : r.trash) && e.trash;
          },
          shared: e => e.isPublic && !e.trash,
        },
        y = e => {
          let { listType: t, createPage: r } = e,
            l = (0, o.X)();
          return (0, a.tZ)('div', {
            className: 'wrs27w0',
            children: (0, a.tZ)(i.HY, {
              title: l['com.affine.emptyDesc'](),
              description: (() => {
                if ('all' === t) {
                  let e = () =>
                    (0, a.tZ)('button', {
                      className: 'wrs27w1',
                      onClick: r,
                      children: 'New Page',
                    });
                  if (n.OB.isDesktop) {
                    let t = n.OB.isMacOs ? '⌘ + N' : 'Ctrl + N';
                    return (0, a.BX)(s.cC, {
                      i18nKey: 'emptyAllPagesClient',
                      children: [
                        'Click on the ',
                        (0, a.tZ)(e, {}),
                        ' button Or press',
                        (0, a.tZ)('kbd', {
                          className: 'wrs27w2 wrs27w1',
                          children: { shortcut: t },
                        }),
                        ' to create your first page.',
                      ],
                    });
                  }
                  return (0, a.BX)(s.cC, {
                    i18nKey: 'emptyAllPages',
                    children: [
                      'Click on the',
                      (0, a.tZ)(e, {}),
                      'button to create your first page.',
                    ],
                  });
                }
                return 'trash' === t
                  ? l.emptyTrash()
                  : 'shared' === t
                  ? l.emptySharedPages()
                  : void 0;
              })(),
            }),
          });
        },
        D = e => {
          let {
              blockSuiteWorkspace: t,
              onOpenPage: r,
              listType: i,
              isPublic: n = !1,
              view: s,
            } = e,
            P = (0, c.r)(t),
            {
              toggleFavorite: v,
              removeToTrash: b,
              restoreFromTrash: D,
              permanentlyDeletePage: C,
              cancelPublicPage: Z,
            } = (0, h.a)(t),
            [N] = (0, p.KO)(k.GE),
            {
              createPage: _,
              createEdgeless: A,
              importFile: E,
              isPreferredEdgeless: I,
            } = w(t),
            S = (0, o.X)(),
            T = (0, g.useMemo)(
              () =>
                P.filter(
                  e =>
                    'all' === N ||
                    ('edgeless' === N
                      ? I(e.id)
                      : 'page' === N
                      ? !I(e.id)
                      : (console.error('unknown filter mode', e, N), !0))
                ).filter(e => {
                  var t;
                  return (
                    !!m[i](e, P) &&
                    (!s ||
                      (0, l.tN)(s.filterList, {
                        'Is Favourited': !!e.favorite,
                        Created: e.createDate,
                        Updated:
                          null !== (t = e.updatedDate) && void 0 !== t
                            ? t
                            : e.createDate,
                      }))
                  );
                }),
              [P, N, I, i, s]
            );
          if ('trash' === i) {
            let e = T.map(e => {
              let i = t.getPage(e.id),
                l = i ? u(i) : void 0;
              return {
                icon: I(e.id)
                  ? (0, a.tZ)(d.EdgelessIcon, {})
                  : (0, a.tZ)(d.PageIcon, {}),
                pageId: e.id,
                title: e.title,
                preview: l,
                createDate: new Date(e.createDate),
                trashDate: e.trashDate ? new Date(e.trashDate) : void 0,
                onClickPage: () => r(e.id),
                onClickRestore: () => {
                  D(e.id);
                },
                onRestorePage: () => {
                  D(e.id),
                    (0, f.A)(S.restored({ title: e.title || 'Untitled' }));
                },
                onPermanentlyDeletePage: () => {
                  C(e.id), (0, f.A)(S['Permanently deleted']());
                },
              };
            });
            return (0, a.tZ)(l.ng, {
              list: e,
              fallback: (0, a.tZ)(y, { listType: i }),
            });
          }
          let B = T.map(e => {
            var i;
            let l = t.getPage(e.id),
              n = l ? u(l) : void 0;
            return {
              icon: I(e.id)
                ? (0, a.tZ)(d.EdgelessIcon, {})
                : (0, a.tZ)(d.PageIcon, {}),
              pageId: e.id,
              title: e.title,
              preview: n,
              favorite: !!e.favorite,
              isPublicPage: !!e.isPublic,
              createDate: new Date(e.createDate),
              updatedDate: new Date(
                null !== (i = e.updatedDate) && void 0 !== i ? i : e.createDate
              ),
              onClickPage: () => r(e.id),
              onOpenPageInNewTab: () => r(e.id, !0),
              onClickRestore: () => {
                D(e.id);
              },
              removeToTrash: () => {
                b(e.id), (0, f.A)(S['Successfully deleted']());
              },
              onRestorePage: () => {
                D(e.id), (0, f.A)(S.restored({ title: e.title || 'Untitled' }));
              },
              bookmarkPage: () => {
                v(e.id),
                  (0, f.A)(
                    e.favorite
                      ? S['Removed from Favorites']()
                      : S['Added to Favorites']()
                  );
              },
              onDisablePublicSharing: () => {
                Z(e.id),
                  (0, f.A)('Successfully disabled', { portal: document.body });
              },
            };
          });
          return (0, a.tZ)(l.LK, {
            onCreateNewPage: _,
            onCreateNewEdgeless: A,
            onImportFile: E,
            isPublicWorkspace: n,
            list: B,
            fallback: (0, a.tZ)(y, { createPage: _, listType: i }),
          });
        };
    },
    8299: function (e, t, r) {
      'use strict';
      r.r(t);
      var a = r(52903),
        i = r(91337),
        l = r(72013),
        n = r(13246),
        s = r(97729),
        o = r.n(s),
        d = r(5632),
        c = r(2784),
        u = r(66844),
        p = r(97274),
        g = r(41142),
        k = r(96450),
        h = r(31747),
        f = r(11264);
      let P = () => {
        let e = (0, d.useRouter)(),
          { jumpToPage: t } = (0, h.$)(e),
          [r] = (0, k.$)(),
          s = (0, l.X)(),
          f = (0, c.useCallback)(
            (e, a) => {
              (0, n.kP)(r),
                a
                  ? window.open(
                      '/workspace/'
                        .concat(null == r ? void 0 : r.id, '/')
                        .concat(e),
                      '_blank'
                    )
                  : t(r.id, e).catch(e => {
                      console.error(e);
                    });
            },
            [r, t]
          );
        if (!e.isReady || null === r) return (0, a.tZ)(g.SX, {});
        let P = r.blockSuiteWorkspace;
        (0, n.kP)(P);
        let { Header: v } = (0, u.getUIAdapter)(r.flavour);
        return (0, a.BX)(a.HY, {
          children: [
            (0, a.tZ)(o(), {
              children: (0, a.BX)('title', {
                children: [s.Trash(), ' - AFFiNE'],
              }),
            }),
            (0, a.tZ)(v, {
              currentWorkspace: r,
              currentEntry: { subPath: i._0.TRASH },
            }),
            (0, a.tZ)(p.BlockSuitePageList, {
              blockSuiteWorkspace: P,
              onOpenPage: f,
              listType: 'trash',
            }),
          ],
        });
      };
      (t.default = P), (P.getLayout = e => (0, a.tZ)(f.PJ, { children: e }));
    },
    91108: function () {},
  },
  function (e) {
    e.O(0, [5024, 4057, 6882, 6675, 1866, 1264, 9774, 2888, 179], function () {
      return e((e.s = 81554));
    }),
      (_N_E = e.O());
  },
]);
//# sourceMappingURL=trash-eb7bcee3fcb79c89.js.map

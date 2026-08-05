/* ==========================================================================
   NAMED STREETS, in map metres — the lookup behind the cursor readout.

   Nineteen named ways from the same OpenStreetMap extract the map itself is drawn
   from (ODbL; see SiteMap.tsx for the provenance and the licence), projected to the
   same local plane: x metres east, y metres south of the site at (0,0). Simplified
   to 4 m and rounded to the metre, which is well inside the precision anything here
   claims — the readout quotes distances to the nearest metre and never to a
   decimal.

   WHY IT EXISTS. The probe can compute a true coordinate under the cursor from the
   projection alone, but a coordinate is not "where you are pointing". Naming the
   nearest street is the closest thing to an address that can be DERIVED rather than
   invented — there is no reverse geocoder in this project and no network call at
   runtime, and guessing a street from a shape would be exactly the fiction the map
   was rebuilt to avoid.

   Flat number arrays per polyline: this ships to the browser, and pairs would
   double the punctuation for no gain. 1.5 KB.
   ========================================================================== */

export type Street = [name: string, lines: number[][]];

export const STREETS: Street[] = [["East Winston Road",[[-24,108,15,142],[-724,47,-125,49,-96,52,-61,75],[-138,332,268,231],[297,150,263,136],[268,231,297,150],[-61,75,-24,108]]],["South Phoenix Club Drive",[[714,333,715,292,724,245]]],["South Auto Center Drive",[[483,-76,533,-77,590,-69,712,-70]]],["South Talt Avenue",[[-270,-86,-275,-71,-276,49]]],["South Douglass Road",[[324,327,336,335]]],["East Omega Avenue",[[-311,-161,135,-157],[135,-197,273,-197]]],["East Riles Circle",[[138,-282,199,-285,238,-278,276,-267,303,-248,322,-228,343,-183,343,-135,337,-117]]],["South State College Parkway",[[-577,-94,-577,48]]],["South Carl Street",[[138,-282,135,-157,125,-92,90,-5,66,34]]],["Shirley Street",[[35,-32,90,-5]]],["East Lark Ellen Lane",[[129,-116,337,-117]]],["South Belhaven Street",[[-320,-304,-318,-168,-311,-161]]],["South Athena Way",[[-67,-299,-67,-255,-185,-254,-185,-161]]],["South Sanderson Avenue",[[568,42,709,47,758,37]]],["Sunburst Way",[[18,-324,18,-161]]],["South Simpson Circle",[[-171,-88,-175,49]]],["Orange Freeway",[[314,287,391,57],[391,57,437,-97,480,-316],[451,-288,419,-113,393,-13,290,289]]],["South State College Boulevard",[[-731,-243,-725,-40],[-725,-19,-724,47],[-725,-40,-725,-19],[-720,-309,-721,-339],[-739,-338,-739,-259,-731,-243],[-720,-258,-720,-309],[-731,-243,-720,-258],[-724,92,-724,333],[-724,47,-724,92]]],["South Sunkist Street",[[75,-305,75,-281],[-27,45,-61,75],[-61,75,-88,110],[73,-141,55,-72,35,-32,-27,45],[-88,110,-115,161,-130,210,-137,254,-138,332],[76,-161,73,-141],[75,-281,75,-189],[75,-189,76,-161]]]];

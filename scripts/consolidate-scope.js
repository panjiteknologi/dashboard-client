const fs = require('fs');
const path = require('path');

// Main function
async function main() {
  console.log('🚀 Memulai konsolidasi scope_en.json...');

  const inputPath = path.join(__dirname, '..', 'src', 'lib', 'scope_en.json');
  const outputPath = path.join(__dirname, '..', 'src', 'lib', 'scope_en_consolidated.json');

  console.log('📖 Membaca file scope_en.json...');
  const rawData = fs.readFileSync(inputPath, 'utf8');
  const scopeData = JSON.parse(rawData);

  console.log('🔄 Menggabungkan data dengan standar, IAF, dan NACE yang sama...');

  const consolidatedData = {};

  // Process each scope (e.g., scope_9001_2015)
  for (const [scopeKey, scopeValue] of Object.entries(scopeData)) {
    const consolidatedScope = {
      standar: scopeValue.standar,
      scope: []
    };

    // Group by IAF_CODE and NACE code
    const grouped = {};

    for (const iafScope of scopeValue.scope) {
      const iafCode = iafScope.IAF_CODE;

      if (!Array.isArray(iafScope.NACE_DETAIL_INFORMATION)) continue;

      for (const naceDetail of iafScope.NACE_DETAIL_INFORMATION) {
        if (!naceDetail.NACE) continue;

        const naceCode = naceDetail.NACE.code;
        const groupKey = `${iafCode}|||${naceCode}`;

        if (!grouped[groupKey]) {
          grouped[groupKey] = {
            IAF_CODE: iafCode,
            NACE_DETAIL_INFORMATION: [{
              NACE: {
                code: naceDetail.NACE.code,
                nace_description: naceDetail.NACE.nace_description
              },
              NACE_CHILD: []
            }]
          };
        }

        // Collect and merge NACE_CHILD by code
        if (Array.isArray(naceDetail.NACE_CHILD)) {
          const naceChildMap = {};

          // First, collect existing NACE_CHILD
          for (const existingChild of grouped[groupKey].NACE_DETAIL_INFORMATION[0].NACE_CHILD) {
            naceChildMap[existingChild.code] = existingChild;
          }

          // Then merge new NACE_CHILD
          for (const newChild of naceDetail.NACE_CHILD) {
            if (naceChildMap[newChild.code]) {
              // Merge nace_child_detail arrays
              if (Array.isArray(newChild.nace_child_detail)) {
                if (!naceChildMap[newChild.code].nace_child_detail) {
                  naceChildMap[newChild.code].nace_child_detail = [];
                }
                naceChildMap[newChild.code].nace_child_detail.push(...newChild.nace_child_detail);
              }
            } else {
              // Add new NACE_CHILD
              naceChildMap[newChild.code] = newChild;
            }
          }

          // Update NACE_CHILD array
          grouped[groupKey].NACE_DETAIL_INFORMATION[0].NACE_CHILD = Object.values(naceChildMap);
        }
      }
    }

    // Convert grouped object back to array
    consolidatedScope.scope = Object.values(grouped);

    consolidatedData[scopeKey] = consolidatedScope;
  }

  console.log('💾 Menyimpan file scope_en_consolidated.json...');
  fs.writeFileSync(outputPath, JSON.stringify(consolidatedData, null, 2), 'utf8');

  console.log('✅ Konsolidasi selesai!');
  console.log('📊 Total scope keys:', Object.keys(consolidatedData).length);

  // Show statistics
  for (const [scopeKey, scopeValue] of Object.entries(consolidatedData)) {
    const totalIAF = scopeValue.scope.length;
    console.log(`   ${scopeKey}: ${totalIAF} IAF codes`);
  }
}

main().catch(console.error);
